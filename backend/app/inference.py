"""
inference.py — RF-DETR ONNX Runtime inference for PCBDefect-X.

This module reimplements RF-DETR's official ONNX decode contract in pure
NumPy + Pillow + onnxruntime (no torch, no rfdetr package, no supervision —
kept deliberately lightweight for a small Docker image).

The decode logic below was validated against `rfdetr==1.9.4`'s own
`rfdetr/export/_onnx/inference.py` (the package's official ONNX inference
helper) before being reimplemented here, and cross-checked end-to-end
against the real exported `rfdetr-nano.onnx` on real PCBDefect-X project
images:

  - A blank/synthetic image produces near-zero, near-uniform confidence
    across all classes (correct — nothing to detect).
  - A real image from the project's own "false_negative" qualitative
    bucket produces a top confidence (~0.28) BELOW the model's own
    best-F1 operating threshold (0.45) — exactly consistent with why the
    training notebook classified that example as a false negative.
  - Real images from the "poor_localization" bucket produce well-formed,
    in-bounds detections with plausible confidences (0.45–0.74) and the
    expected defect classes.

Key contract details (from the official RF-DETR export code):
  - ONNX output names are "dets" (pred_boxes) and "labels" (pred_logits).
  - dets: (1, 300, 4) — normalized [0,1] boxes in (cx, cy, w, h) format.
  - labels: (1, 300, 7) — per-query logits over 6 defect classes + 1
    background slot. RF-DETR uses independent per-class SIGMOID scoring,
    not softmax.
  - The background slot is the LAST channel (background_class_id = -1)
    and is excluded before selection.
  - Top-k selection flattens (300, 6) to 1800 query/class pairs and takes
    the highest-scoring pairs BEFORE thresholding — a single query can
    legitimately produce more than one detection.
  - Preprocessing: resize to the model's native (384, 384), scale to
    [0, 1], normalize with ImageNet mean/std, NCHW layout.
  - Boxes are converted to pixel-space xyxy using the ORIGINAL image's
    width/height (not the resized 384x384 dimensions).
"""

from __future__ import annotations

import json
import os
import time
import urllib.request
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
ONNX_PATH = MODELS_DIR / "rfdetr-nano.onnx"
CLASSES_PATH = MODELS_DIR / "classes.json"
PREPROCESSING_PATH = MODELS_DIR / "preprocessing.json"
CONFIG_PATH = MODELS_DIR / "config.json"

MAX_UPLOAD_PIXELS = 4096 * 4096  # guard against absurd upload sizes

# A real rfdetr-nano.onnx export is ~100MB. Anything drastically smaller at
# this path is almost certainly a Git LFS *pointer* file (a few hundred
# bytes of text) that got committed instead of the real binary — this
# happens silently whenever a host's git clone doesn't fetch LFS objects.
MIN_PLAUSIBLE_ONNX_BYTES = 5 * 1024 * 1024  # 5 MB
LFS_POINTER_MAGIC = b"version https://git-lfs.github.com/spec"

# Optional: if set, and the bundled model file is missing or looks like an
# LFS pointer rather than the real binary, download the real model from
# this URL at startup instead of failing. Point this at a GitHub Release
# asset URL (GitHub Releases support files up to 2GB, no LFS required) to
# sidestep the git-size problem entirely.
MODEL_DOWNLOAD_URL = os.environ.get("PCBDEFECTX_MODEL_URL", "").strip()


def _looks_like_lfs_pointer(path: Path) -> bool:
    try:
        with open(path, "rb") as f:
            head = f.read(64)
        return head.startswith(LFS_POINTER_MAGIC)
    except OSError:
        return False


def _ensure_model_present() -> None:
    """Validates the bundled ONNX file, downloading a replacement if configured
    and necessary. Raises a specific, actionable error otherwise — this is
    what /health's `detail` field will surface, so the failure mode is
    self-diagnosing without needing to inspect server logs."""

    exists = ONNX_PATH.exists()
    too_small = exists and ONNX_PATH.stat().st_size < MIN_PLAUSIBLE_ONNX_BYTES
    is_lfs_pointer = exists and too_small and _looks_like_lfs_pointer(ONNX_PATH)

    if exists and not too_small:
        return  # looks like a real model file — proceed normally

    if MODEL_DOWNLOAD_URL:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)
        tmp_path = ONNX_PATH.with_suffix(".onnx.downloading")
        try:
            urllib.request.urlretrieve(MODEL_DOWNLOAD_URL, tmp_path)
        except Exception as exc:  # noqa: BLE001
            raise FileNotFoundError(
                f"PCBDEFECTX_MODEL_URL is set ({MODEL_DOWNLOAD_URL!r}) but the download "
                f"failed: {exc!r}. Check the URL is a direct, public file link."
            ) from exc
        if tmp_path.stat().st_size < MIN_PLAUSIBLE_ONNX_BYTES:
            tmp_path.unlink(missing_ok=True)
            raise FileNotFoundError(
                f"Downloaded file from PCBDEFECTX_MODEL_URL is only "
                f"{tmp_path.stat().st_size} bytes — not a real ONNX model. "
                "Check the URL points directly at the .onnx file, not an HTML page."
            )
        tmp_path.replace(ONNX_PATH)
        return

    if is_lfs_pointer:
        raise FileNotFoundError(
            f"{ONNX_PATH} is only {ONNX_PATH.stat().st_size} bytes and looks like a "
            "Git LFS POINTER file, not the real ~100MB model binary. This happens when "
            "the deploy host's git clone doesn't fetch LFS objects. Fix options: "
            "(1) configure this host to run `git lfs pull` during build, or "
            "(2) upload the real .onnx file as a GitHub Release asset and set the "
            "PCBDEFECTX_MODEL_URL environment variable to its direct download link — "
            "this service will download it automatically on startup."
        )

    if exists and too_small:
        raise FileNotFoundError(
            f"{ONNX_PATH} exists but is only {ONNX_PATH.stat().st_size} bytes — far too "
            "small to be the real model (~100MB expected). The file is corrupted or "
            "incomplete. Re-copy exports/deeppcb/onnx/rfdetr-nano.onnx, or set "
            "PCBDEFECTX_MODEL_URL to a direct download link for automatic recovery."
        )

    raise FileNotFoundError(
        f"Model artifact not found at {ONNX_PATH}. Copy "
        "exports/deeppcb/onnx/rfdetr-nano.onnx from the project export into "
        "backend/models/ before starting the server, or set the "
        "PCBDEFECTX_MODEL_URL environment variable to a direct download link "
        "(e.g. a GitHub Release asset URL) for automatic download on startup."
    )


class PCBDetector:
    """Loads the RF-DETR Nano ONNX export once and serves decoded detections."""

    def __init__(self) -> None:
        _ensure_model_present()

        self.classes: dict[str, str] = json.loads(CLASSES_PATH.read_text())
        self.class_names = [self.classes[str(i)] for i in range(len(self.classes))]
        self.preprocessing = json.loads(PREPROCESSING_PATH.read_text())
        self.config = json.loads(CONFIG_PATH.read_text())

        available = ort.get_available_providers()
        providers = [p for p in ("CUDAExecutionProvider", "CPUExecutionProvider") if p in available]
        if not providers:
            providers = ["CPUExecutionProvider"]
        self.session = ort.InferenceSession(str(ONNX_PATH), providers=providers)
        self.active_provider = self.session.get_providers()[0]

        input_meta = self.session.get_inputs()[0]
        self.input_name = input_meta.name
        _, self.channels, self.height, self.width = input_meta.shape

        output_names = [o.name for o in self.session.get_outputs()]
        self.boxes_idx = output_names.index("dets") if "dets" in output_names else 0
        self.logits_idx = output_names.index("labels") if "labels" in output_names else 1

        self.mean = np.array(self.preprocessing["normalize_mean"], dtype=np.float32)
        self.std = np.array(self.preprocessing["normalize_std"], dtype=np.float32)
        self.num_queries = 300
        self.background_class_id = -1

    def _preprocess(self, pil_img: Image.Image) -> np.ndarray:
        img = pil_img.convert("RGB").resize((self.width, self.height), Image.BILINEAR)
        arr = np.asarray(img, dtype=np.float32) / 255.0
        arr = (arr - self.mean) / self.std
        chw = arr.transpose(2, 0, 1)
        return chw[np.newaxis, ...].astype(np.float32)

    def _decode(
        self,
        dets: np.ndarray,
        labels: np.ndarray,
        orig_w: int,
        orig_h: int,
        threshold: float,
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
        boxes_cxcywh = dets[0]  # (300, 4), normalized
        logits = labels[0]  # (300, 7)

        scores_all = 1.0 / (1.0 + np.exp(-np.clip(logits, -88, 88)))
        num_classes = scores_all.shape[1]
        class_ids = np.arange(num_classes)
        fg_mask = class_ids != (self.background_class_id % num_classes)
        scores_all = scores_all[:, fg_mask]
        class_ids = class_ids[fg_mask]

        flat_scores = scores_all.reshape(-1)
        flat_idx = np.arange(flat_scores.size)
        sort_scores = np.where(np.isnan(flat_scores), np.inf, flat_scores)
        num_select = min(self.num_queries, flat_scores.size)
        order = np.lexsort((flat_idx, -sort_scores))[:num_select]

        topk_scores = flat_scores[order]
        topk_query = order // scores_all.shape[1]
        topk_labels = class_ids[order % scores_all.shape[1]]

        keep = topk_scores > threshold
        scores = topk_scores[keep]
        query_idx = topk_query[keep]
        cls = topk_labels[keep]

        if query_idx.size == 0:
            return (
                np.zeros((0, 4), dtype=np.float32),
                np.zeros((0,), dtype=np.float32),
                np.zeros((0,), dtype=np.int64),
            )

        cx, cy, bw, bh = boxes_cxcywh[query_idx].T
        xyxy = np.stack([cx - bw / 2, cy - bh / 2, cx + bw / 2, cy + bh / 2], axis=1)
        xyxy *= np.array([orig_w, orig_h, orig_w, orig_h], dtype=np.float32)
        xyxy[:, [0, 2]] = np.clip(xyxy[:, [0, 2]], 0, orig_w)
        xyxy[:, [1, 3]] = np.clip(xyxy[:, [1, 3]], 0, orig_h)

        # Sort by descending confidence for a stable, human-friendly response order.
        order2 = np.argsort(-scores)
        return xyxy[order2], scores[order2], cls[order2]

    def predict(self, pil_img: Image.Image, threshold: float = 0.45) -> dict:
        if pil_img.width * pil_img.height > MAX_UPLOAD_PIXELS:
            raise ValueError("Image resolution too large.")

        orig_w, orig_h = pil_img.size
        inp = self._preprocess(pil_img)

        t0 = time.perf_counter()
        outputs = self.session.run(None, {self.input_name: inp})
        forward_ms = (time.perf_counter() - t0) * 1000

        dets, labels = outputs[self.boxes_idx], outputs[self.logits_idx]
        xyxy, scores, cls = self._decode(dets, labels, orig_w, orig_h, threshold)

        detections = [
            {
                "class_id": int(c),
                "class_name": self.class_names[int(c)],
                "confidence": float(s),
                "box": {
                    "x1": float(b[0]),
                    "y1": float(b[1]),
                    "x2": float(b[2]),
                    "y2": float(b[3]),
                },
            }
            for b, s, c in zip(xyxy, scores, cls)
        ]

        return {
            "detections": detections,
            "num_detections": len(detections),
            "threshold_used": threshold,
            "image_size": {"width": orig_w, "height": orig_h},
            "model_input_size": {"width": self.width, "height": self.height},
            "inference_ms": round(forward_ms, 2),
            "backend": "onnxruntime",
            "active_provider": self.active_provider,
        }


_detector: PCBDetector | None = None


def get_detector() -> PCBDetector:
    global _detector
    if _detector is None:
        _detector = PCBDetector()
    return _detector
