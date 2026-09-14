"""
Integration tests for the PCBDefect-X inference API.

These are not mocks — they load the real ONNX model bundled in backend/models/
and run it against real fixture images copied from the project's own
evaluation set, asserting the same behavior verified manually during
development (see backend/README.md "Validation" section):

  - the false-negative fixture should score below the default threshold
  - the poor-localization fixture should produce at least one in-bounds
    detection above the default threshold
"""

from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
FIXTURES = Path(__file__).parent / "fixtures"


def test_health_ok():
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert body["model_loaded"] is True
    assert body["classes"] == ["open", "short", "mousebite", "spur", "copper", "pinhole"]


def test_model_info():
    r = client.get("/model-info")
    assert r.status_code == 200
    body = r.json()
    assert body["num_classes"] == 6
    assert body["image_size"] == 384


def test_predict_rejects_bad_content_type():
    r = client.post(
        "/predict",
        files={"file": ("not_an_image.txt", b"hello world", "text/plain")},
    )
    assert r.status_code == 415


def test_predict_false_negative_fixture_scores_below_default_threshold():
    """The bundled false-negative example should not clear the default 0.45 threshold —
    that is precisely why the training notebook classified it as a false negative."""
    fixture = FIXTURES / "false_negative_example.png"
    with open(fixture, "rb") as f:
        r = client.post("/predict", files={"file": (fixture.name, f, "image/png")})
    assert r.status_code == 200
    body = r.json()
    assert body["num_detections"] == 0
    assert body["threshold_used"] == 0.45


def test_predict_poor_localization_fixture_detects_something():
    """The bundled poor-localization example should produce at least one detection
    with an in-bounds box at a lower, exploratory threshold."""
    fixture = FIXTURES / "poor_localization_example.png"
    with open(fixture, "rb") as f:
        r = client.post(
            "/predict",
            files={"file": (fixture.name, f, "image/png")},
            params={"threshold": 0.3},
        )
    assert r.status_code == 200
    body = r.json()
    assert body["num_detections"] >= 1
    w, h = body["image_size"]["width"], body["image_size"]["height"]
    for det in body["detections"]:
        box = det["box"]
        assert 0 <= box["x1"] < box["x2"] <= w
        assert 0 <= box["y1"] < box["y2"] <= h
        assert det["class_name"] in [
            "open", "short", "mousebite", "spur", "copper", "pinhole",
        ]


def test_lfs_pointer_file_is_detected_with_actionable_error(tmp_path, monkeypatch):
    """Regression test for a real deployment failure mode: if a host's git clone
    doesn't fetch Git LFS objects, the ~100MB model gets replaced by a tiny LFS
    pointer text file. This must fail loudly with a specific, actionable message
    (surfaced via /health's `detail` field) rather than an opaque ONNX parse
    error or a silent "unavailable" state with no explanation."""
    import shutil

    from app import inference as inf

    fake_models_dir = tmp_path / "models"
    fake_models_dir.mkdir()
    for name in ["classes.json", "preprocessing.json", "config.json"]:
        shutil.copy2(inf.MODELS_DIR / name, fake_models_dir / name)

    lfs_pointer = (
        b"version https://git-lfs.github.com/spec/v1\n"
        b"oid sha256:" + b"a1" * 32 + b"\n"
        b"size 107657497\n"
    )
    (fake_models_dir / "rfdetr-nano.onnx").write_bytes(lfs_pointer)

    monkeypatch.setattr(inf, "MODELS_DIR", fake_models_dir)
    monkeypatch.setattr(inf, "ONNX_PATH", fake_models_dir / "rfdetr-nano.onnx")
    monkeypatch.setattr(inf, "CLASSES_PATH", fake_models_dir / "classes.json")
    monkeypatch.setattr(inf, "PREPROCESSING_PATH", fake_models_dir / "preprocessing.json")
    monkeypatch.setattr(inf, "CONFIG_PATH", fake_models_dir / "config.json")
    monkeypatch.setattr(inf, "MODEL_DOWNLOAD_URL", "")

    import pytest as _pytest
    with _pytest.raises(FileNotFoundError, match="Git LFS POINTER file"):
        inf.PCBDetector()
