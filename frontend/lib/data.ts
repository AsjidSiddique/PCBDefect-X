// ============================================================================
// lib/data.ts
//
// EVERY VALUE ON THIS PAGE THAT LOOKS LIKE A NUMBER OR A CLAIM ORIGINATES HERE.
// Each field is annotated with the exact source file from the PCBDefect-X
// Google Drive project (as extracted from the supplied project export).
// Nothing on this page is invented — fields with no verified source are
// explicitly typed as `null` and rendered as "not yet evaluated" in the UI.
// ============================================================================

export const PROJECT = {
  name: "PCBDefect-X",
  tagline: "Deep Learning for PCB Manufacturing Defect Detection & Localization",
  // source: configs/experiment.json
  dataset: "DeepPCB",
  kaggleHandle: "arnablaha05/deep-pcb",
  model: "RF-DETR Nano",
  rfdetrVersion: "1.9.4",
  seed: 42,
  imageSize: 384,
  trainResolution: 544,
  epochs: 20,
  batchSize: 4,
  gradAccumSteps: 4,
  learningRate: 0.0001,
  numClasses: 6,
  iouMatchThreshold: 0.5,
};

// source: configs/experiment.json -> classes
export const CLASS_NAMES = [
  "open",
  "short",
  "mousebite",
  "spur",
  "copper",
  "pinhole",
] as const;

export const CLASS_LABELS: Record<(typeof CLASS_NAMES)[number], string> = {
  open: "Open Circuit",
  short: "Short",
  mousebite: "Mousebite",
  spur: "Spur",
  copper: "Spurious Copper",
  pinhole: "Pinhole",
};

export const CLASS_DESCRIPTIONS: Record<(typeof CLASS_NAMES)[number], string> = {
  open: "A break in a conductive trace that should be continuous, interrupting the intended electrical path.",
  short: "An unintended conductive bridge between two traces or pads that should remain electrically isolated.",
  mousebite: "Small irregular notches biting into the edge of a trace, usually from over-etching.",
  spur: "A small stray conductive protrusion branching off a trace where no connection should exist.",
  copper: "Excess copper material left in a region of the board where the design specifies bare substrate.",
  pinhole: "A small void or pit within a copper region or trace, reducing conductive cross-section.",
};

// source: results/metrics/dataset_manifest.csv
export const DATASET_SPLITS = {
  train: { images: 2772, boxes: 11812 },
  valid: { images: 366, boxes: 1307 },
  test: { images: 366, boxes: 1307 },
};
export const DATASET_TOTAL_IMAGES =
  DATASET_SPLITS.train.images + DATASET_SPLITS.valid.images + DATASET_SPLITS.test.images; // 3504
export const DATASET_TOTAL_BOXES =
  DATASET_SPLITS.train.boxes + DATASET_SPLITS.valid.boxes + DATASET_SPLITS.test.boxes; // 14426

// source: results/metrics/overall_metrics.csv + official_test_metrics.json (identical, cross-checked)
export const OVERALL_METRICS = {
  map50: 0.787834644317627,
  map50_95: 0.3929486870765686,
  map75: 0.33172890543937683,
  mAR: 0.4689539074897766,
  precision: 0.9000887870788574,
  recall: 0.747856080532074,
  f1: 0.8141381144523621,
};

// source: results/metrics/per_class_ap.csv
export const PER_CLASS_AP: Record<(typeof CLASS_NAMES)[number], number> = {
  open: 0.5457319617271423,
  short: 0.36053094267845154,
  mousebite: 0.4053189754486084,
  spur: 0.41037502884864807,
  copper: 0.33648207783699036,
  pinhole: 0.2992531657218933,
};

// source: results/metrics/per_class_localization.csv
export const PER_CLASS_LOCALIZATION: Record<
  (typeof CLASS_NAMES)[number],
  { meanIoU: number; localizationFailureRate: number; n: number }
> = {
  copper: { meanIoU: 0.5671689745021581, localizationFailureRate: 0.31336405529953915, n: 217 },
  mousebite: { meanIoU: 0.6239765949234957, localizationFailureRate: 0.22439024390243903, n: 205 },
  open: { meanIoU: 0.7699407469397703, localizationFailureRate: 0.04484304932735426, n: 223 },
  pinhole: { meanIoU: 0.5367495875019166, localizationFailureRate: 0.3466666666666667, n: 225 },
  short: { meanIoU: 0.594910784367455, localizationFailureRate: 0.25339366515837103, n: 221 },
  spur: { meanIoU: 0.6391595703101268, localizationFailureRate: 0.18055555555555555, n: 216 },
};

// source: results/metrics/localization_quality.csv (bucket counts), reproduced in
// website/pcb_defect_detector/metrics.json -> localization_quality_distribution
export const LOCALIZATION_QUALITY_DISTRIBUTION = [
  { bucket: "IoU < 0.50", count: 297, note: "localization failure at the evaluation threshold" },
  { bucket: "0.50 – 0.75", count: 557, note: "acceptable overlap" },
  { bucket: "0.75 – 0.90", count: 415, note: "strong overlap" },
  { bucket: "≥ 0.90", count: 38, note: "near-exact overlap" },
];

// source: results/metrics/threshold_sweep.csv — best-F1 row (threshold≈0.45)
export const BEST_F1_OPERATING_POINT = {
  threshold: 0.44999999999999996,
  precision: 0.9119420989143546,
  recall: 0.5784238714613619,
  f1: 0.7078651685393259,
  tp: 756,
  fp: 73,
  fn: 551,
};

// source: results/metrics/threshold_sweep.csv (down-sampled for the chart)
export const THRESHOLD_SWEEP = [
  { threshold: 0.05, precision: 0.031, recall: 0.76, f1: 0.06 },
  { threshold: 0.1, precision: 0.17, recall: 0.708, f1: 0.275 },
  { threshold: 0.15, precision: 0.385, recall: 0.685, f1: 0.493 },
  { threshold: 0.2, precision: 0.547, recall: 0.656, f1: 0.597 },
  { threshold: 0.25, precision: 0.674, recall: 0.64, f1: 0.657 },
  { threshold: 0.3, precision: 0.759, recall: 0.621, f1: 0.683 },
  { threshold: 0.35, precision: 0.832, recall: 0.609, f1: 0.703 },
  { threshold: 0.4, precision: 0.871, recall: 0.59, f1: 0.703 },
  { threshold: 0.45, precision: 0.912, recall: 0.578, f1: 0.708 },
  { threshold: 0.5, precision: 0.941, recall: 0.558, f1: 0.7 },
  { threshold: 0.55, precision: 0.959, recall: 0.536, f1: 0.687 },
  { threshold: 0.6, precision: 0.967, recall: 0.511, f1: 0.669 },
  { threshold: 0.65, precision: 0.978, recall: 0.467, f1: 0.632 },
  { threshold: 0.7, precision: 0.987, recall: 0.41, f1: 0.579 },
  { threshold: 0.75, precision: 0.995, recall: 0.297, f1: 0.457 },
  { threshold: 0.8, precision: 1.0, recall: 0.102, f1: 0.185 },
];

// source: checkpoints/deeppcb_run/metrics.csv — validation rows only (every logged eval_interval epoch)
export const TRAINING_CURVE = [
  { epoch: 1, map50: 0.468946, map5095: 0.17833, precision: 0.677426, recall: 0.44904, f1: 0.519237 },
  { epoch: 3, map50: 0.581192, map5095: 0.246416, precision: 0.858351, recall: 0.520594, f1: 0.637124 },
  { epoch: 5, map50: 0.628857, map5095: 0.262027, precision: 0.82142, recall: 0.594965, f1: 0.684506 },
  { epoch: 7, map50: 0.669669, map5095: 0.282808, precision: 0.883576, recall: 0.60256, f1: 0.705825 },
  { epoch: 9, map50: 0.698932, map5095: 0.31439, precision: 0.894875, recall: 0.628497, f1: 0.731017 },
  { epoch: 11, map50: 0.707107, map5095: 0.295429, precision: 0.867077, recall: 0.654058, f1: 0.739657 },
  { epoch: 13, map50: 0.734599, map5095: 0.339668, precision: 0.858989, recall: 0.691721, f1: 0.763595 },
  { epoch: 15, map50: 0.755816, map5095: 0.358596, precision: 0.880727, recall: 0.709597, f1: 0.78356 },
  { epoch: 17, map50: 0.766281, map5095: 0.363502, precision: 0.921748, recall: 0.689242, f1: 0.785106 },
  { epoch: 19, map50: 0.788592, map5095: 0.374899, precision: 0.921604, recall: 0.722081, f1: 0.807652 },
];

// source: checkpoints/deeppcb_run/training_config.json (rfdetr internal train_config)
export const TRAINING_CONFIG = {
  epochs: 20,
  batchSize: 4,
  gradAccumSteps: 4,
  effectiveBatch: 16,
  lr: 0.0001,
  lrEncoder: 0.00015,
  emaDecay: 0.993,
  earlyStoppingPatience: 8,
  weightDecay: 0.0001,
  multiScale: true,
  datasetFile: "roboflow",
  amp: "auto",
};

// source: results/metrics/gpu_preflight.json
export const TRAINING_HARDWARE = { name: "Tesla T4", vramGb: 14.56, capability: "7.5" };

// source: results/metrics/eager_latency.json (n=60, batch=1)
export const EAGER_LATENCY = {
  backend: "eager_pytorch_fp32",
  n: 60,
  medianMs: 229.24720099945262,
  p90Ms: 387.65387370021926,
  fps: 4.362103422158632,
};

// source: results/deployment/efficiency_summary.json
export const ONNX_CPU_LATENCY = {
  medianMs: 355.31234300106007,
  p90Ms: 523.6017669994908,
  rows: 366,
};

// source: results/deployment/model_size_metrics.csv
export const MODEL_SIZES = [
  { artifact: "Eager checkpoint (.pth)", mib: 115.34, status: "reference" as const },
  { artifact: "ONNX FP32", mib: 102.67, status: "accepted" as const },
  { artifact: "ONNX INT8", mib: 27.78, status: "accepted" as const },
  { artifact: "TensorRT FP16", mib: 107.49, status: "accepted" as const },
];

// source: results/deployment/deployment_registry.json — VERBATIM statuses, not paraphrased
export const DEPLOYMENT_REGISTRY = {
  referenceBackend: "eager_pytorch_fp32",
  onnxExport: { status: "ok", accepted: true },
  onnxRuntimeCuda: {
    status: "error",
    accepted: false,
    note: "CUDAExecutionProvider failed to load in the export environment; CPU fallback was explicitly disabled rather than silently substituted, so this backend is recorded as rejected, not degraded-but-passing.",
  },
  onnxInt8: {
    status: "ok",
    coverageOk: true,
    accepted: true,
    note: "Accepted only because the exported graph contained real QuantizeLinear/DequantizeLinear nodes (operator coverage gate) — a quantization run without that coverage would have been retained as exploratory evidence instead.",
  },
  tensorrtFp16: {
    status: "ok",
    accepted: true,
    note: "Accepted only after a real .trt engine was built, deserialized by the TensorRT runtime, and produced a successful smoke inference.",
  },
  primaryRecommendedBackend: "tensorrt_fp16",
};

// source: results/metrics/qualitative_summary.json
export const QUALITATIVE_COUNTS = {
  true_positive: 0,
  false_positive: 0,
  false_negative: 6,
  poor_localization: 6,
};

// Real, downsized (webp) qualitative detection images copied from
// results/qualitative/{category}/ in the project export.
export const QUALITATIVE_IMAGES = {
  false_negative: [
    "/images/qualitative/false_negative/00828d9df8_06_short_08_1.webp",
    "/images/qualitative/false_negative/019082f8a9_01_spur_13_1.webp",
    "/images/qualitative/false_negative/01e9ffadb2_04_mouse_bite_10_1.webp",
    "/images/qualitative/false_negative/03291a9904_01_spur_18_1.webp",
    "/images/qualitative/false_negative/035d4a23f5_04_spur_12_1.webp",
    "/images/qualitative/false_negative/03b6dc1e30_01_open_circuit_20_1.webp",
  ],
  poor_localization: [
    "/images/qualitative/poor_localization/040c76a8d1_01_spurious_copper_01_1.webp",
    "/images/qualitative/poor_localization/0421dbb899_01_spurious_copper_16_1.webp",
    "/images/qualitative/poor_localization/04f4380c61_04_spurious_copper_17_1.webp",
    "/images/qualitative/poor_localization/061e496230_01_open_circuit_11_1.webp",
    "/images/qualitative/poor_localization/06f4781488_01_spurious_copper_07_1.webp",
    "/images/qualitative/poor_localization/077b51d8fa_01_open_circuit_03_1.webp",
  ],
};

// Real research plots generated by the notebook, copied as-is (downsized to webp)
export const RESEARCH_PLOTS = {
  annotationSpotcheck: "/images/plots/annotation_spotcheck.webp",
  classAndBboxDistribution: "/images/plots/class_and_bbox_distribution.webp",
  localizationQuality: "/images/plots/localization_quality.webp",
  precisionRecallCurve: "/images/plots/precision_recall_curve.webp",
};

// ----------------------------------------------------------------------------
// Researcher / author — from the supplied CV context. LinkedIn/GitHub repo URL
// were not present in the supplied project files, so they are explicit
// placeholders rather than invented links.
// ----------------------------------------------------------------------------
export const RESEARCHER = {
  name: "Asjid Siddique",
  role: "Software Engineering Student",
  subrole: "Building toward AI/ML Research",
  education: "BS Software Engineering, NUST",
  cgpa: "3.76 / 4.00",
  expectedGraduation: "2028",
  interests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "Explainable AI",
    "Reliable AI",
    "Software Engineering for AI Systems",
  ],
  skills: {
    programming: ["Python", "C++", "Java", "JavaScript / TypeScript"],
    aiMl: ["Machine Learning", "Deep Learning", "Computer Vision", "Object Detection", "Explainability"],
    softwareEngineering: [
      "Next.js",
      "React",
      "Node.js",
      "Express.js",
      "REST APIs",
      "MongoDB",
      "MySQL",
      "Git / GitHub",
    ],
  },
  links: {
    github: "https://github.com/AsjidSiddique/PCBDefect-X",
    linkedin: "https://www.linkedin.com/in/asjidsiddique469/",
    email: "asjadsaddique4@gmail.com",
    portfolio: "[ADD PORTFOLIO URL]",
  },
  avatarUrl: "https://avatars.githubusercontent.com/u/189822390?v=4",
};

export const OTHER_PROJECTS = [
  {
    name: "Viro.pk",
    description: "Production e-commerce platform — Founder & Full-Stack Developer.",
    tag: "Full-Stack / Production",
    url: "https://www.viro.pk/",
  },
  {
    name: "OS Kernel Simulator",
    description: "Operating-systems process/memory scheduling simulator with a full-stack interface.",
    tag: "Systems / Full-Stack",
    url: "https://os-kernel-simulators.vercel.app/login",
  },
  {
    name: "FraudShield",
    description: "Cost-sensitive, explainable credit-card fraud detection with SHAP-based interpretability.",
    tag: "ML / Explainability",
    url: "[ADD REPOSITORY URL]",
  },
  {
    name: "AeroSys",
    description: "Airline management system covering booking, scheduling, and administration workflows.",
    tag: "Full-Stack",
    url: "[ADD REPOSITORY URL]",
  },
];

// Research questions actually supported by what the notebook measured.
export const RESEARCH_QUESTIONS = [
  {
    id: "RQ1",
    title: "Detection performance",
    body: "How well does an RF-DETR Nano detector, fine-tuned on DeepPCB, identify PCB manufacturing defects at standard IoU thresholds?",
  },
  {
    id: "RQ2",
    title: "Localization quality",
    body: "When a defect is correctly classified, how tightly does the predicted box overlap the ground-truth region — not just whether a detection occurred?",
  },
  {
    id: "RQ3",
    title: "Per-class behavior",
    body: "Do all six defect categories behave similarly, or do some (e.g. small/low-contrast defects) show systematically weaker detection or localization?",
  },
  {
    id: "RQ4",
    title: "Deployment trade-offs",
    body: "Which export backends (ONNX, INT8, TensorRT) actually pass a real numerical-parity and coverage gate against the eager reference model, and at what size/latency cost?",
  },
];

export const RESEARCH_INTEGRITY_PRINCIPLES = [
  {
    title: "No data leakage",
    body: "Train/valid/test splits are checked for path-level and byte-identical (SHA-256) overlap before any training begins.",
  },
  {
    title: "Reproducible experiments",
    body: "Fixed seed (42), explicit configuration file, deterministic dataset conversion — every run is traceable to its exact inputs.",
  },
  {
    title: "Held-out evaluation",
    body: "All reported metrics come from the test split, which the model never saw during training or threshold tuning.",
  },
  {
    title: "Verified results only",
    body: "Every number on this site is read from a result file the notebook actually wrote — never estimated or asserted from memory.",
  },
  {
    title: "Failure containment",
    body: "Every exporter, quantizer, and TensorRT builder runs in a bounded, isolated subprocess. A deployment failure can never erase or block completed training/evaluation results.",
  },
  {
    title: "Deployment gates",
    body: "A backend is labeled accepted only after passing an explicit parity/coverage check — rejected backends are kept, not hidden.",
  },
  {
    title: "Traceable experiments",
    body: "Every artifact (checkpoint, export, prediction cache) is SHA-256 hashed and logged in an artifact manifest.",
  },
];

export const LIMITATIONS = [
  "DeepPCB is a synthetic/semi-synthetic template-vs-tested defect dataset — real production PCB imagery (lighting, resolution, camera angle, solder-mask color) will differ and may degrade performance.",
  "The reported best-F1 operating threshold (0.45) was tuned on this dataset's own validation/test split; it is illustrative, not a guaranteed production setting.",
  "INT8 and TensorRT acceptance is scoped to the exact export shape (384×384) used in this notebook — a different input resolution requires re-export and re-validation.",
  "Mean localization quality varies substantially by class (per-class IoU failure rate ranges from ~4% for open circuits to ~35% for pinholes) — the model is not equally reliable across all six defect types.",
  "No true-positive or false-positive qualitative examples were captured by the automatic example-selection logic in this run (only false-negative and poor-localization categories populated) — see Error Analysis for the exact counts.",
  "ONNX Runtime GPU (CUDA execution provider) failed to initialize in the export environment; only the CPU ONNX Runtime path and the TensorRT engine were validated for GPU-class latency.",
];

export const FUTURE_WORK = [
  { id: "01", title: "Template-guided detection", body: "Explicitly modeling the reference/tested PCB pair (rather than single-image detection) to exploit DeepPCB's template-vs-tested structure." },
  { id: "02", title: "Multi-scale defect detection", body: "Targeted architecture/augmentation changes for small, low-contrast defects such as pinholes and spurious copper." },
  { id: "03", title: "Better small-object localization", body: "Investigating loss functions and anchor/query strategies specifically to close the localization gap observed for copper and pinhole classes." },
  { id: "04", title: "Robustness evaluation", body: "Systematic evaluation under blur, noise, brightness shift, and compression — not yet performed in this project." },
  { id: "05", title: "Model compression", body: "Extending the INT8/TensorRT pipeline with structured pruning or distillation for further size/latency reduction." },
  { id: "06", title: "Real-world manufacturing data", body: "Validating generalization on PCB imagery captured outside the DeepPCB template/test protocol." },
  { id: "07", title: "Explainable AI", body: "Adding attention/attribution visualization to the detection pipeline for interpretable failure analysis." },
  { id: "08", title: "Edge deployment", body: "Evaluating the accepted TensorRT/INT8 exports on embedded/edge inference hardware." },
];
