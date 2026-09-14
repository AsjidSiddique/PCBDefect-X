"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, MetricCard, SectionHeading, Badge } from "@/components/ui/Primitives";
import {
  BEST_F1_OPERATING_POINT,
  OVERALL_METRICS,
  QUALITATIVE_IMAGES,
  RESEARCH_PLOTS,
} from "@/lib/data";

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function ResultsSection() {
  return (
    <section id="results" className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Results"
            title="From Model Training to Defect Localization"
            description="All values below are computed on the held-out DeepPCB test split (366 images, 1,307 annotated boxes) that the model never saw during training or threshold selection."
          />
        </Reveal>

        <RevealStagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <RevealItem>
            <MetricCard label="mAP@50" value={pct(OVERALL_METRICS.map50)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="mAP@50:95" value={pct(OVERALL_METRICS.map50_95)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="Precision" value={pct(OVERALL_METRICS.precision)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="Recall" value={pct(OVERALL_METRICS.recall)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="F1" value={pct(OVERALL_METRICS.f1)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="mAP@75" value={pct(OVERALL_METRICS.map75)} />
          </RevealItem>
          <RevealItem>
            <MetricCard label="mAR" value={pct(OVERALL_METRICS.mAR)} />
          </RevealItem>
          <RevealItem>
            <MetricCard
              label="Best-F1 Threshold"
              value={BEST_F1_OPERATING_POINT.threshold.toFixed(2)}
              note={`P ${pct(BEST_F1_OPERATING_POINT.precision)} · R ${pct(BEST_F1_OPERATING_POINT.recall)}`}
            />
          </RevealItem>
        </RevealStagger>

        <Reveal delay={0.1} className="mt-10">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                Precision–Recall Curve (class-aware IoU match)
              </span>
              <span className="text-xs text-muted">
                {BEST_F1_OPERATING_POINT.tp} TP · {BEST_F1_OPERATING_POINT.fp} FP ·{" "}
                {BEST_F1_OPERATING_POINT.fn} FN at best-F1 threshold
              </span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <Image
                src={RESEARCH_PLOTS.precisionRecallCurve}
                alt="Precision-recall curve and confidence threshold sweep"
                width={1600}
                height={600}
                className="h-auto w-full"
              />
            </div>
          </Card>
        </Reveal>

        <ResultExplorer />
      </div>
    </section>
  );
}

const TABS = [
  { key: "false_negative", label: "False Negative", tone: "fail" as const },
  { key: "poor_localization", label: "Poor Localization", tone: "warn" as const },
] as const;

function ResultExplorer() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("false_negative");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const images = QUALITATIVE_IMAGES[tab];

  return (
    <div className="mt-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
            Interactive Result Explorer
          </span>
          <p className="mt-1 text-sm text-muted">
            Precomputed research inference — ground truth in green, prediction in red, drawn
            directly by the evaluation pipeline.
          </p>
        </div>
        <Badge tone="warn">Precomputed Research Inference</Badge>
      </div>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
              tab === t.key
                ? "border-accent/40 bg-accent-soft text-foreground"
                : "border-border text-muted hover:border-border-strong"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <RevealStagger className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {images.map((src) => (
          <RevealItem key={src}>
            <button
              onClick={() => setLightbox(src)}
              className="group block w-full overflow-hidden rounded-lg border border-border bg-surface-2 text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={src}
                  alt={`${tab} example`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="border-t border-border px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-2">
                Click to inspect
              </div>
            </button>
          </RevealItem>
        ))}
      </RevealStagger>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-6 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-6 top-6 rounded-full border border-border p-2 text-foreground"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="relative max-h-[85vh] max-w-5xl overflow-hidden rounded-lg border border-border-strong">
            <Image
              src={lightbox}
              alt="Detection example, enlarged"
              width={1400}
              height={1000}
              className="h-auto max-h-[85vh] w-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
