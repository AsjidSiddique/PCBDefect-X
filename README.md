# PCBDefect-X

A full-stack deep-learning research project: RF-DETR Nano fine-tuned on DeepPCB for PCB
manufacturing defect detection, with a research website (`frontend/`) and a genuine live-inference
API (`backend/`) — structured the same way as the FraudShield project (`frontend/` + `backend/`,
Docker-deployable backend, Vercel-deployable frontend).

```
PCBDefect-X/
├── frontend/   Next.js research site + live "Detection Playground"
└── backend/    FastAPI + ONNX Runtime inference API (real trained model)
```

## Run everything locally

**Backend** (terminal 1):

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (terminal 2):

```bash
cd frontend
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open `http://localhost:3000`, scroll to **Live Demo** (or click "Try Live Detection" in the hero),
upload a PCB image, and it will call the real backend and draw real detections.

## What's genuinely live vs. precomputed — stated plainly

| Section | Data source |
|---|---|
| Results, PR curve, training curves | **Precomputed** — real numbers from the training notebook's result files |
| Interactive Result Explorer (false-negative / poor-localization galleries) | **Precomputed** — real images from the notebook's own evaluation run, labeled as such |
| **Detection Playground** (`#live-demo`) | **Live** — every upload runs the actual `rfdetr-nano.onnx` model through a real FastAPI + ONNX Runtime backend |

## Deployment (matching the FraudShield pattern)

1. **Backend → Render** (or any Docker host): connect the repo, root directory `backend`,
   runtime Docker, instance type Free/paid. Set `PCBDEFECTX_ALLOWED_ORIGINS` to your deployed
   frontend's exact origin once known.
2. **Frontend → Vercel**: connect the repo, root directory `frontend`. Set env var
   `NEXT_PUBLIC_API_URL` to the Render backend URL. Deploy.
3. Update `PCBDEFECTX_ALLOWED_ORIGINS` on Render to the real Vercel URL and redeploy the backend
   (or leave `*` if you're comfortable with an open CORS policy for a portfolio demo).

See `backend/README.md` and `frontend/README.md` for full details, including exactly how the
ONNX decode logic was validated against the real model before being wired into the API (three
real-image checks — a blank-image sanity check, a false-negative-bucket confidence check, and a
poor-localization-bucket detection check — all encoded as automated tests in
`backend/tests/test_inference.py` and re-verified via real HTTP requests immediately before
delivery).

## Links

- Live-projects referenced from the "Other Work" section: [Viro.pk](https://www.viro.pk/),
  [OS Kernel Simulator](https://os-kernel-simulators.vercel.app/login)
- Contact: [LinkedIn](https://www.linkedin.com/in/asjidsiddique469/), asjadsaddique4@gmail.com
- Still placeholders (not supplied): GitHub repository URL, portfolio URL, FraudShield/AeroSys
  repository links — search `[ADD ...]` in `frontend/lib/data.ts`.
