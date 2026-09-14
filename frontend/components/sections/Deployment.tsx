import { CheckCircle2, XCircle } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading, StatusPill } from "@/components/ui/Primitives";
import {
  DEPLOYMENT_REGISTRY,
  EAGER_LATENCY,
  MODEL_SIZES,
  ONNX_CPU_LATENCY,
} from "@/lib/data";

const BACKENDS = [
  {
    key: "onnxExport",
    label: "ONNX Export",
    status: DEPLOYMENT_REGISTRY.onnxExport.accepted ? ("accepted" as const) : ("rejected" as const),
    note: "FP32 graph exported at 384×384, checked with onnx.checker, and verified with a CPU ONNX Runtime forward pass.",
  },
  {
    key: "onnxRuntimeCuda",
    label: "ONNX Runtime — CUDA",
    status: DEPLOYMENT_REGISTRY.onnxRuntimeCuda.accepted ? ("accepted" as const) : ("rejected" as const),
    note: DEPLOYMENT_REGISTRY.onnxRuntimeCuda.note,
  },
  {
    key: "onnxInt8",
    label: "ONNX INT8 (QDQ)",
    status: DEPLOYMENT_REGISTRY.onnxInt8.accepted ? ("accepted" as const) : ("rejected" as const),
    note: DEPLOYMENT_REGISTRY.onnxInt8.note,
  },
  {
    key: "tensorrtFp16",
    label: "TensorRT FP16",
    status: DEPLOYMENT_REGISTRY.tensorrtFp16.accepted ? ("accepted" as const) : ("rejected" as const),
    note: DEPLOYMENT_REGISTRY.tensorrtFp16.note,
  },
];

export function DeploymentSection() {
  return (
    <section id="deployment" className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="From Research to Deployment"
            title="Deployment Backend Gate"
            description="Every export backend is attempted in an isolated, bounded subprocess and only labeled accepted after passing a real numerical-parity and coverage check against the eager PyTorch reference. Nothing here is upgraded from a failed status."
          />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {BACKENDS.map((b) => (
            <RevealItem key={b.key}>
              <Card className="h-full">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">{b.label}</h4>
                  <StatusPill status={b.status} />
                </div>
                <div className="mb-3 flex items-center gap-2 text-xs">
                  {b.status === "accepted" ? (
                    <CheckCircle2 size={14} className="text-ok" />
                  ) : (
                    <XCircle size={14} className="text-fail" />
                  )}
                  <span className="font-mono uppercase tracking-wider text-muted-2">
                    {b.status === "accepted" ? "Parity gate passed" : "Parity gate failed / unavailable"}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted">{b.note}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.1} className="mt-8">
          <Card className="border-accent/25 bg-accent-soft/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  Primary Recommended Backend
                </span>
                <p className="mt-1 text-lg font-semibold text-foreground">TensorRT FP16</p>
              </div>
              <p className="max-w-md text-sm text-muted">
                Selected automatically by the deployment registry as the strongest backend that
                actually passed its acceptance gate — not a default or a marketing choice.
              </p>
            </div>
          </Card>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <Reveal delay={0.12}>
            <Card>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                Model Size by Artifact
              </span>
              <div className="mt-4 space-y-3">
                {MODEL_SIZES.map((m) => {
                  const max = Math.max(...MODEL_SIZES.map((x) => x.mib));
                  const pct = (m.mib / max) * 100;
                  return (
                    <div key={m.artifact}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted">{m.artifact}</span>
                        <span className="font-tabular text-foreground">{m.mib.toFixed(1)} MiB</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-surface-3">
                        <div
                          className="h-1.5 rounded-full bg-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.16}>
            <Card>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                Latency (batch = 1)
              </span>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <div className="text-sm text-foreground">Eager PyTorch FP32</div>
                    <div className="text-xs text-muted">n = {EAGER_LATENCY.n} forward passes</div>
                  </div>
                  <div className="text-right">
                    <div className="font-tabular text-lg font-semibold text-foreground">
                      {EAGER_LATENCY.medianMs.toFixed(0)} ms
                    </div>
                    <div className="text-xs text-muted">{EAGER_LATENCY.fps.toFixed(1)} FPS median</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-foreground">ONNX Runtime (CPU)</div>
                    <div className="text-xs text-muted">n = {ONNX_CPU_LATENCY.rows} images</div>
                  </div>
                  <div className="text-right">
                    <div className="font-tabular text-lg font-semibold text-foreground">
                      {ONNX_CPU_LATENCY.medianMs.toFixed(0)} ms
                    </div>
                    <div className="text-xs text-muted">
                      p90 {ONNX_CPU_LATENCY.p90Ms.toFixed(0)} ms
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted">
                TensorRT/GPU end-to-end latency was not separately isolated from eager latency in
                the exported project logs at time of writing — reported here only where a source
                file exists.
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
