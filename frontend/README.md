# PCBDefect-X — Research Website

A premium, animated Next.js research website for **PCBDefect-X**, a deep-learning computer-vision
project detecting and localizing PCB manufacturing defects (RF-DETR Nano on DeepPCB).

**Navigation model:** the header (with GitHub link and contact button) and footer are persistent
across the whole site. Clicking a nav item — Research / Dataset / Method / Results / Analysis /
Deployment / About — is a real Next.js route change to its own page, animated by
`components/layout/PageTransition.tsx`, not a long anchor-scroll down one giant page.

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

Both commands were verified to complete with **zero TypeScript errors, zero ESLint errors, and
zero broken imports** immediately before delivery.

## Stack

- Next.js 15.5 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4
- Framer Motion (scroll reveals, hero sequencing)
- Recharts (training curves, per-class AP)
- lucide-react (icons)
- Live inference calls a companion FastAPI backend (`../backend`) via `lib/api.ts`

## Structure

```
app/
  layout.tsx          — root layout: SEO/OpenGraph metadata, persistent Navbar/Footer,
                         wraps route content in <PageTransition>
  page.tsx            — Home: Hero + "Navigate the Research" quick-nav grid
  research/page.tsx   — Research Overview, Research Questions, Template↔Tested, Data Pipeline
  dataset/page.tsx    — Dataset stats + Defect Taxonomy
  method/page.tsx     — Model architecture + Training curves
  results/page.tsx    — Overall metrics, PR curve, Result Explorer, Live Detection Playground
  analysis/page.tsx   — Per-class analysis + Error analysis
  deployment/page.tsx — Deployment registry, Engineering, Reproducibility, Limitations
  about/page.tsx      — Future work, Conclusion, Researcher, Other Projects, Final CTA
  globals.css         — PCBDefect-X design tokens (dark PCB-lab palette)
components/
  effects/
    CircuitField.tsx      — ambient PCB-trace canvas background (signature visual system)
    InspectionVisual.tsx  — hero animation: template → tested → difference → detection loop
    LoadingScreen.tsx      — ~1s initial loading sequence
    Reveal.tsx             — scroll-reveal wrapper (respects prefers-reduced-motion)
  layout/
    Navbar.tsx          — persistent header; real routes via next/link, active-route highlight
    Footer.tsx          — persistent footer
    PageTransition.tsx  — AnimatePresence wrapper keyed on pathname; animates page swaps,
                          resets scroll position on every navigation
  sections/
    Hero.tsx
    QuickNav.tsx                — Home page's "Navigate the Research" card grid
    ResearchOverview.tsx        — "Why PCB Defect Detection?" + Research Question / RQ1–RQ4
    Dataset.tsx                 — dataset stats + defect taxonomy (interactive)
    TemplatePipeline.tsx        — Template→Tested→Difference signature section + generic pipeline diagram
    ModelTraining.tsx           — model architecture flow + training curves (real data)
    Results.tsx                 — overall metrics, PR curve, interactive result explorer/lightbox
    LiveDetection.tsx           — "Detection Playground": real image upload, calls the live backend, draws returned boxes
    Analysis.tsx                — per-class analysis (interactive) + error analysis
    Deployment.tsx              — deployment registry, honest accepted/rejected status per backend
    Engineering.tsx             — architecture diagram, reproducibility, research integrity, limitations
    FutureConclusion.tsx        — future work + "what did we learn"
    About.tsx                   — researcher profile (with avatar), other projects, final CTA
  ui/
    Primitives.tsx        — Badge, StatusPill, SectionHeading, Card, MetricCard
lib/
  data.ts                — SINGLE SOURCE OF TRUTH for every number/claim on the site,
                           each field commented with its exact source file
  api.ts                 — typed client for the live inference backend (../backend)
  routes.ts              — the 7 header-nav routes, shared by Navbar and the Home quick-nav grid
public/
  images/plots/                — real research plots (PR curve, class distribution, localization quality, annotation spot-check)
  images/qualitative/           — real false-negative and poor-localization detection examples
  og-image.png, favicon.svg
```

## Verified project information used

Every number, status, and claim rendered on the page was extracted directly from the supplied
`PCBDefect-X` project export (`results/`, `checkpoints/`, `configs/`, `website/pcb_defect_detector/`).
See the header comment and inline source annotations in `lib/data.ts` for the exact file each
field came from. Highlights:

- Dataset: DeepPCB, 3,504 images (2,772 train / 366 valid / 366 test), 14,426 boxes — `results/metrics/dataset_manifest.csv`
- Overall test metrics: mAP@50 78.8%, mAP@50:95 39.3%, Precision 90.0%, Recall 74.8%, F1 81.4% — `results/metrics/overall_metrics.csv`
- Per-class AP and per-class localization (IoU) — `results/metrics/per_class_ap.csv`, `per_class_localization.csv`
- Training curve (validation mAP/precision/recall per logged epoch) — `checkpoints/deeppcb_run/metrics.csv`
- Deployment registry (ONNX/INT8/TensorRT accepted; ONNX CUDA rejected, with real error) — `results/deployment/deployment_registry.json`
- Model size and latency — `results/deployment/model_size_metrics.csv`, `results/metrics/eager_latency.json`, `results/deployment/efficiency_summary.json`
- Qualitative examples (6 false-negative, 6 poor-localization; 0 true-positive, 0 false-positive) — `results/metrics/qualitative_summary.json` + the actual images in `results/qualitative/`

## Missing information / placeholders

These were **not** present in the supplied project export and are rendered as explicit
placeholders rather than invented:

- `RESEARCHER.links.portfolio` — personal portfolio URL
- `OTHER_PROJECTS` entries for FraudShield / AeroSys — repository links

Search for `[ADD ...]` in `lib/data.ts` and replace with real URLs before publishing. GitHub
(`https://github.com/AsjidSiddique/PCBDefect-X`), LinkedIn, email, Viro.pk, and OS Kernel Simulator
links were supplied and are already wired in throughout the Navbar, Footer, Hero, and About page.

Also not available in the export, and therefore intentionally scoped as **Future Work** rather
than fabricated:
- Robustness evaluation (blur/noise/brightness/compression) — not performed in the supplied
  project; listed under Future Work and Limitations instead.
- True-positive and false-positive qualitative image examples in the "Interactive Result Explorer"
  — the export's automatic example selector captured zero of each (see `qualitative_summary.json`);
  this is stated plainly in the Error Analysis section rather than hidden. The live Detection
  Playground is a separate feature and is not affected by this gap — it runs fresh inference on
  whatever the user uploads.
- GPU/TensorRT end-to-end latency numbers beyond what `efficiency_summary.json` contains.

## Live inference — how it actually works

The **Detection Playground** (on the `/results` page) is genuine live inference, not a precomputed
result explorer:

1. On mount, the section pings `${NEXT_PUBLIC_API_URL}/health` and shows a connected/unavailable
   badge — it never silently pretends the backend is up.
2. An uploaded image is sent as `multipart/form-data` to `${NEXT_PUBLIC_API_URL}/predict`.
3. The backend (`../backend`) runs the actual trained `rfdetr-nano.onnx` via ONNX Runtime and
   returns real boxes/classes/confidences — see `../backend/README.md` for how that decode logic
   was validated against the real model before being wired in here.
4. The frontend draws the returned boxes on an HTML canvas positioned over the uploaded image —
   nothing is pre-rendered or faked.

If the backend isn't reachable (not yet deployed, or asleep on a free hosting tier), the section
says so directly rather than falling back to a fake result.

## Design notes

- Palette, animation system (`CircuitField`, `InspectionVisual`), and copy were built fresh for
  this project — they do not reuse the visual identity of any previously supplied reference
  project. The reference project was inspected only for its general tech stack (Next.js +
  TypeScript + Tailwind + Framer Motion + Recharts) and animation *technique* (canvas-based
  ambient background), not its design language.
- All images were re-encoded to WebP and downscaled for web delivery (originals in the supplied
  export ran up to ~17 MB each; shipped assets are all under 550 KB).
- Respects `prefers-reduced-motion` throughout (loading screen, reveals, ambient background).

## Performance considerations

- 8 statically-generated routes (`/`, `/research`, `/dataset`, `/method`, `/results`, `/analysis`,
  `/deployment`, `/about`), each with its own optimized JS bundle (~138–250 kB first load
  depending on page content) instead of one large single-page bundle. Navigation between them is
  a real Next.js client-side route change, animated by `PageTransition.tsx` — not an anchor scroll.
- The only runtime data fetching is the Detection Playground's `/health` check and `/predict`
  call, both to the companion backend; every other page is statically known at build time.
- Canvas background is capped to a bounded node/trace count and disables cursor-follow on mobile.
- Images use Next's `<Image>` component (including the remote GitHub avatar, via
  `remotePatterns` in `next.config.ts`); large qualitative/plot assets are WebP.
- The Detection Playground's canvas overlay is sized to the uploaded image's natural resolution
  and redrawn only on new results — no continuous render loop.

## Not yet done (explicitly out of scope for this pass)

- A `/research-mode` deep-technical toggle (spec item #56) was not implemented — everything is
  currently shown at the "default" depth described in the spec.
- Cursor micro-interaction / coordinate readout (spec item #60) was not implemented.
- The Detection Playground calls the ONNX FP32 backend only; the project's TensorRT FP16 engine
  is hardware/version-locked and is not served over HTTP — see `../backend/README.md`.
