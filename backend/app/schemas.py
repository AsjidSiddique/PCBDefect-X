from __future__ import annotations

from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class Detection(BaseModel):
    class_id: int
    class_name: str
    confidence: float
    box: BoundingBox


class PredictionResponse(BaseModel):
    detections: list[Detection]
    num_detections: int
    threshold_used: float
    image_size: dict[str, int]
    model_input_size: dict[str, int]
    inference_ms: float
    backend: str
    active_provider: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model: str
    dataset: str
    classes: list[str]
    active_provider: str | None = None
    detail: str | None = None


class ModelInfoResponse(BaseModel):
    model: str
    dataset: str
    num_classes: int
    classes: list[str]
    image_size: int
    served_backend: str
    default_threshold: float = Field(
        description="The notebook's own best-F1 operating threshold, used as the API default."
    )
    onnx_backend_note: str
