"""
PCBDefect-X inference API.

Serves the actual trained RF-DETR Nano model (ONNX export) fine-tuned on
DeepPCB. `/predict` runs genuine live inference on the uploaded image — it
does not return precomputed or cached results.
"""

from __future__ import annotations

import io
import os

from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

from app.inference import get_detector
from app.schemas import HealthResponse, ModelInfoResponse, PredictionResponse

app = FastAPI(
    title="PCBDefect-X Inference API",
    description="Live RF-DETR Nano PCB defect detection, served via ONNX Runtime.",
    version="1.0.0",
)

_allowed_origins = os.environ.get("PCBDEFECTX_ALLOWED_ORIGINS", "*")
origins = ["*"] if _allowed_origins.strip() == "*" else [o.strip() for o in _allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/tiff"}
MAX_UPLOAD_BYTES = 15 * 1024 * 1024  # 15 MB


@app.get("/", tags=["meta"])
def root():
    return {"service": "pcbdefect-x-api", "docs": "/docs", "health": "/health"}


@app.get("/health", response_model=HealthResponse, tags=["meta"])
def health():
    try:
        detector = get_detector()
        return HealthResponse(
            status="ok",
            model_loaded=True,
            model="RF-DETR Nano",
            dataset="DeepPCB",
            classes=detector.class_names,
            active_provider=detector.active_provider,
        )
    except Exception as exc:  # noqa: BLE001 — surfaced deliberately in the health payload
        return HealthResponse(
            status="error",
            model_loaded=False,
            model="RF-DETR Nano",
            dataset="DeepPCB",
            classes=[],
            detail=repr(exc),
        )


@app.get("/model-info", response_model=ModelInfoResponse, tags=["meta"])
def model_info():
    detector = get_detector()
    return ModelInfoResponse(
        model="RF-DETR Nano",
        dataset="DeepPCB",
        num_classes=len(detector.class_names),
        classes=detector.class_names,
        image_size=detector.width,
        served_backend="onnxruntime (ONNX FP32 export)",
        default_threshold=detector.config.get("confidence_operating_threshold", 0.45),
        onnx_backend_note=(
            "This API always serves the ONNX FP32 export via ONNX Runtime, which is "
            "portable across CPU-only hosting. The project's TensorRT FP16 engine is "
            "hardware/version-locked and is not served here — see the Deployment "
            "section of the research site for its real acceptance status."
        ),
    )


@app.post("/predict", response_model=PredictionResponse, tags=["inference"])
async def predict(
    file: UploadFile = File(...),
    threshold: float = Query(
        default=0.45,
        ge=0.01,
        le=0.99,
        description="Confidence threshold (0.01-0.99). Default matches the notebook's best-F1 operating point.",
    ),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported content type '{file.content_type}'. Allowed: {sorted(ALLOWED_CONTENT_TYPES)}",
        )

    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 15 MB).")

    try:
        pil_img = Image.open(io.BytesIO(raw))
        pil_img.load()
    except UnidentifiedImageError as exc:
        raise HTTPException(status_code=422, detail="Could not decode image file.") from exc

    detector = get_detector()
    try:
        result = detector.predict(pil_img, threshold=threshold)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc!r}") from exc

    return PredictionResponse(**result)
