"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, UploadCloud, Wifi, WifiOff } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { Badge, Card, SectionHeading } from "@/components/ui/Primitives";
import { checkHealth, runInference, type Detection, type HealthResponse, type PredictionResponse } from "@/lib/api";
import { CLASS_LABELS, CLASS_NAMES } from "@/lib/data";

const CLASS_COLORS: Record<string, string> = {
  open: "#35e0c2",
  short: "#f0546a",
  mousebite: "#f0b429",
  spur: "#4f8cff",
  copper: "#c084fc",
  pinhole: "#fb923c",
};

function classColor(name: string) {
  return CLASS_COLORS[name] ?? "#35e0c2";
}

export function LiveDetectionSection() {
  const [health, setHealth] = useState<HealthResponse | null | "checking">("checking");
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(0.45);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    checkHealth().then(setHealth);
  }, []);

  const drawDetections = useCallback((detections: Detection[]) => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const d of detections) {
      const color = classColor(d.class_name);
      const { x1, y1, x2, y2 } = d.box;
      ctx.lineWidth = Math.max(2, canvas.width / 400);
      ctx.strokeStyle = color;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      const label = `${d.class_name} ${(d.confidence * 100).toFixed(0)}%`;
      ctx.font = `${Math.max(14, canvas.width / 60)}px monospace`;
      const metrics = ctx.measureText(label);
      const pad = 4;
      const labelH = Math.max(18, canvas.width / 45);
      ctx.fillStyle = color;
      ctx.fillRect(x1, Math.max(0, y1 - labelH), metrics.width + pad * 2, labelH);
      ctx.fillStyle = "#05070B";
      ctx.fillText(label, x1 + pad, Math.max(labelH - 4, y1 - 5));
    }
  }, []);

  useEffect(() => {
    if (result) drawDetections(result.detections);
  }, [result, drawDetections]);

  function handleFile(f: File) {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, WEBP, BMP, or TIFF).");
      return;
    }
    setError(null);
    setResult(null);
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageUrl(url);
  }

  async function handleRun() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await runInference(file, threshold);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Inference request failed.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  }

  const backendUp = health && health !== "checking" && health.status === "ok";

  return (
    <section id="live-demo" className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Live Inference"
            title="Detection Playground"
            description="Upload a PCB image and this page calls the actual trained RF-DETR Nano model (ONNX Runtime) running on a live backend — not a precomputed example. Best results come from top-down images similar to DeepPCB's test set."
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-6 flex justify-center">
          {health === "checking" ? (
            <Badge tone="default">
              <Loader2 size={12} className="animate-spin" /> Checking inference backend…
            </Badge>
          ) : backendUp ? (
            <Badge tone="ok">
              <Wifi size={12} /> Live model backend connected — {health.active_provider}
            </Badge>
          ) : (
            <Badge tone="fail">
              <WifiOff size={12} /> Inference backend unavailable
            </Badge>
          )}
        </Reveal>

        {!backendUp && health !== "checking" && (
          <Reveal delay={0.1} className="mx-auto mt-6 max-w-xl">
            <Card className="border-fail/25 bg-[rgba(240,84,106,0.06)] text-center">
              <p className="text-sm text-muted">
                The live inference API isn&rsquo;t reachable right now (it may be asleep on a free
                hosting tier, or not yet deployed). This is stated plainly rather than falling back
                to a fake result — see the Results section above for real, precomputed evaluation
                examples in the meantime.
              </p>
            </Card>
          </Reveal>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <Card className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden p-0">
            {!imageUrl ? (
              <label
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) handleFile(f);
                }}
                className={`flex h-full min-h-[360px] w-full cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${
                  dragActive ? "border-accent bg-accent-soft" : "border-border-strong"
                }`}
              >
                <UploadCloud size={28} className="text-muted-2" />
                <span className="text-sm font-medium text-foreground">
                  Drop a PCB image here, or click to browse
                </span>
                <span className="text-xs text-muted">JPEG, PNG, WEBP · up to 15 MB</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            ) : (
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Uploaded PCB for live detection"
                  className="w-full"
                  onLoad={() => result && drawDetections(result.detections)}
                />
                <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
              </div>
            )}
          </Card>

          <div className="flex flex-col gap-5">
            <Card>
              <label className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-wider text-muted-2">
                  Confidence Threshold
                </span>
                <span className="font-tabular text-foreground">{threshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0.05}
                max={0.95}
                step={0.01}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="mt-3 w-full accent-[#35e0c2]"
              />
              <p className="mt-2 text-xs text-muted">
                Default (0.45) matches the notebook&rsquo;s own best-F1 operating point.
              </p>
            </Card>

            <div className="flex gap-3">
              <button
                onClick={handleRun}
                disabled={!file || loading || !backendUp}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : null}
                {loading ? "Running inference…" : "Run Detection"}
              </button>
              <button
                onClick={reset}
                disabled={!imageUrl}
                className="flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Reset"
              >
                <RefreshCw size={15} />
              </button>
            </div>

            {error && (
              <Card className="border-fail/30 bg-[rgba(240,84,106,0.06)]">
                <div className="flex items-start gap-2 text-sm text-fail">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              </Card>
            )}

            {result && (
              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                    Result
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {result.inference_ms.toFixed(0)} ms · {result.active_provider}
                  </span>
                </div>
                {result.num_detections === 0 ? (
                  <p className="text-sm text-muted">
                    No defects detected above threshold {result.threshold_used.toFixed(2)}.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {result.detections.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-md border border-border bg-surface-2 px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: classColor(d.class_name) }}
                          />
                          {CLASS_LABELS[d.class_name as (typeof CLASS_NAMES)[number]] ?? d.class_name}
                        </span>
                        <span className="font-tabular text-muted">
                          {(d.confidence * 100).toFixed(1)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
