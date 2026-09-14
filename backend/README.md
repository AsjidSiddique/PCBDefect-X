# PCBDefect-X — Inference API

A FastAPI service that serves the **actual trained RF-DETR Nano model** (ONNX export) fine-tuned
on DeepPCB. `/predict` runs genuine live inference on an uploaded image — nothing here is
precomputed or cached.

## Run locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Then visit `http://localhost:8000/docs` for interactive API docs.

## Run with Docker

```bash
docker build -t pcbdefectx-api .
docker run -p 8000:8000 pcbdefectx-api
```

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Model load status, active ONNX Runtime provider, class list |
| GET | `/model-info` | Model metadata, default operating threshold, backend notes |
| POST | `/predict?threshold=0.45` | Upload an image (`multipart/form-data`, field `file`), get real detections |

Example:

```bash
curl -X POST "http://localhost:8000/predict?threshold=0.45" \
  -F "file=@your_pcb_image.jpg"
```

Response:

```json
{
  "detections": [
    {"class_id": 3, "class_name": "spur", "confidence": 0.746,
     "box": {"x1": 1120.6, "y1": 802.5, "x2": 1172.2, "y2": 856.0}}
  ],
  "num_detections": 1,
  "threshold_used": 0.45,
  "image_size": {"width": 1400, "height": 1038},
  "model_input_size": {"width": 384, "height": 384},
  "inference_ms": 394.23,
  "backend": "onnxruntime",
  "active_provider": "CPUExecutionProvider"
}
```

## Validation performed before shipping this

The decode logic in `app/inference.py` reimplements RF-DETR's own official ONNX inference
contract (`rfdetr/export/_onnx/inference.py` in `rfdetr==1.9.4`) — sigmoid scoring over 6
foreground classes + 1 excluded background slot, flatten-then-topk selection across 300 queries,
cxcywh → pixel-space xyxy conversion using the *original* image size. This was not assumed; it was
read from the installed package's source before being reimplemented in pure NumPy here.

It was then cross-checked end-to-end against the real, exported `rfdetr-nano.onnx`:

- **Synthetic blank image** → near-zero, near-uniform confidence across all classes. Correct: no
  content, so no defect should register.
- **A real image from the project's own `false_negative` qualitative bucket** → top confidence
  ≈0.28, below the model's own best-F1 operating threshold (0.45). This matches *why the training
  notebook itself* classified that example as a false negative — the API reproduces the same
  judgment the original evaluation pipeline made.
- **Real images from the `poor_localization` bucket** → well-formed, in-bounds detections with
  plausible confidences (0.57–0.75) and correct defect-class labels.

These three checks are encoded as automated tests in `tests/test_inference.py`, which run against
the real bundled ONNX model (not a mock) and real fixture images copied from the project's own
evaluation set. Run them with:

```bash
pytest tests/ -v
```

They were also verified via real HTTP requests to a running `uvicorn` instance (not just
`TestClient`), confirming the exact request/response shape the frontend uses.

## What this API does *not* claim

- It serves the **ONNX FP32** export via ONNX Runtime — portable to CPU-only hosting. It does
  **not** serve the project's TensorRT FP16 engine, which is hardware/TensorRT-version-locked and
  would fail to load on most standard hosting. See `/model-info` and the research site's
  Deployment section for that backend's real, separately-recorded acceptance status.
- Confidence threshold defaults to the notebook's own best-F1 operating point (0.45), not an
  arbitrary value.
- No claim is made about accuracy on PCB imagery outside the DeepPCB template/test protocol —
  see the research site's Limitations section.

## Deploying (Render, matching the FraudShield project's setup)

1. Push this repo (or the `backend/` subfolder) to GitHub.
2. Render → New → Web Service → connect the repo → Root Directory: `backend` → Runtime: Docker →
   Instance Type: Free (or a paid tier if you need lower cold-start latency).
3. Set environment variable `PCBDEFECTX_ALLOWED_ORIGINS` to your deployed frontend's exact origin
   (e.g. `https://pcbdefect-x.vercel.app`) once you know it — defaults to `*` otherwise.
4. Note the resulting service URL and set it as `NEXT_PUBLIC_API_URL` in the frontend's Vercel
   environment variables (see the root README).
