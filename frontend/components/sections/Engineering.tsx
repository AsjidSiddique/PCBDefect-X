import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { LIMITATIONS, RESEARCH_INTEGRITY_PRINCIPLES } from "@/lib/data";

const ARCH_STAGES = [
  "Dataset",
  "Preprocessing",
  "Training",
  "Checkpoints",
  "Evaluation",
  "Export",
  "Inference",
  "Web Interface",
];

const TECH = [
  "Python", "PyTorch", "RF-DETR", "OpenCV", "NumPy", "Pandas",
  "ONNX Runtime", "TensorRT", "FastAPI", "Next.js", "TypeScript", "Git / GitHub",
];

export function EngineeringSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Engineering The System"
            title="From Notebook to Deployable Artifact"
            description="This project is a complete engineering pipeline, not a single notebook cell — every stage below writes its own verifiable artifact."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12 overflow-x-auto">
          <div className="flex min-w-max items-center gap-3 pb-2">
            {ARCH_STAGES.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm font-medium text-foreground">
                  {s}
                </div>
                {i < ARCH_STAGES.length - 1 && <ArrowRight size={16} className="text-border-strong" />}
              </div>
            ))}
          </div>
        </Reveal>

        <RevealStagger className="mt-10 flex flex-wrap gap-2">
          {TECH.map((t) => (
            <RevealItem key={t}>
              <span className="rounded-full border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted">
                {t}
              </span>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

export function ReproducibilityIntegritySection() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Reproducibility & Research Integrity"
            title="Traceable, Verifiable, Gated"
            description="Every experiment in this project is reconstructable from its configuration, and every deployment claim is backed by a passing gate — not an assumption."
          />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH_INTEGRITY_PRINCIPLES.map((p) => (
            <RevealItem key={p.title}>
              <Card className="h-full">
                <div className="mb-3 flex items-center gap-2 text-accent">
                  <ShieldCheck size={16} />
                  <h4 className="text-sm font-semibold text-foreground">{p.title}</h4>
                </div>
                <p className="text-sm leading-relaxed text-muted">{p.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.15} className="mt-8">
          <Card className="border-border-strong">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
              Experiment Manifest
            </span>
            <div className="mt-4 grid gap-3 font-mono text-xs sm:grid-cols-2 lg:grid-cols-4">
              {[
                "configs/experiment.json",
                "checkpoints/deeppcb_run/training_config.json",
                "results/metrics/dataset_manifest.csv",
                "results/metrics/artifact_manifest.csv",
                "results/deployment/deployment_registry.json",
                "results/metrics/claim_checklist.json",
                "scripts/train_worker.py",
                "scripts/build_trt.py",
              ].map((f) => (
                <div key={f} className="truncate rounded-md border border-border bg-surface-2 px-3 py-2 text-muted">
                  {f}
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function LimitationsSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Limitations"
            title="What This Project Does Not Yet Show"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 space-y-4">
            {LIMITATIONS.map((l, i) => (
              <div key={i} className="flex gap-4 border-b border-border pb-4 last:border-0">
                <span className="mt-0.5 font-mono text-xs text-muted-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-muted">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
