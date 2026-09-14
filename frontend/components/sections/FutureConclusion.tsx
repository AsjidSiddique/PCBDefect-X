import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { FUTURE_WORK, OVERALL_METRICS, PER_CLASS_LOCALIZATION } from "@/lib/data";

export function FutureWorkSection() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading eyebrow="Where This Goes Next" title="Future Work" />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FUTURE_WORK.map((f) => (
            <RevealItem key={f.id}>
              <Card className="h-full">
                <span className="font-mono text-xs text-accent">{f.id}</span>
                <h4 className="mt-1 text-sm font-semibold text-foreground">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

const worstLocalizationClass = Object.entries(PER_CLASS_LOCALIZATION).sort(
  (a, b) => b[1].localizationFailureRate - a[1].localizationFailureRate
)[0];
const bestLocalizationClass = Object.entries(PER_CLASS_LOCALIZATION).sort(
  (a, b) => a[1].localizationFailureRate - b[1].localizationFailureRate
)[0];

const FINDINGS = [
  {
    id: "01",
    title: "Detection",
    body: `RF-DETR Nano reaches ${(OVERALL_METRICS.map50 * 100).toFixed(1)}% mAP@50 and ${(OVERALL_METRICS.precision * 100).toFixed(0)}% precision on held-out DeepPCB test images — defects are reliably flagged, at the cost of stricter localization (mAP@50:95 is substantially lower at ${(OVERALL_METRICS.map50_95 * 100).toFixed(1)}%).`,
  },
  {
    id: "02",
    title: "Localization",
    body: `Only ${(((557 + 415 + 38) / (297 + 557 + 415 + 38)) * 100).toFixed(0)}% of ground-truth objects reach IoU ≥ 0.50 — recognizing that a defect exists is easier for this model than drawing a tight box around it.`,
  },
  {
    id: "03",
    title: "Class-Specific Behavior",
    body: `"${bestLocalizationClass[0]}" defects localize most reliably (${(bestLocalizationClass[1].localizationFailureRate * 100).toFixed(0)}% failure rate), while "${worstLocalizationClass[0]}" defects are the hardest to box tightly (${(worstLocalizationClass[1].localizationFailureRate * 100).toFixed(0)}% failure rate) — likely reflecting their small, low-contrast visual footprint.`,
  },
  {
    id: "04",
    title: "Deployment",
    body: "Of four attempted export backends, ONNX, INT8, and TensorRT all passed their acceptance gates on this hardware — ONNX Runtime's CUDA execution provider did not, and is honestly reported as rejected rather than silently downgraded to CPU.",
  },
];

export function ConclusionSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading eyebrow="Research Conclusion" title="What Did We Learn?" />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2">
          {FINDINGS.map((f) => (
            <RevealItem key={f.id}>
              <Card className="h-full border-accent/15">
                <span className="font-mono text-xs text-accent">{f.id}</span>
                <h4 className="mt-1 text-base font-semibold text-foreground">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
