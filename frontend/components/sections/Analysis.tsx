"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Image from "next/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading, Badge } from "@/components/ui/Primitives";
import {
  CLASS_LABELS,
  CLASS_NAMES,
  PER_CLASS_AP,
  PER_CLASS_LOCALIZATION,
  LOCALIZATION_QUALITY_DISTRIBUTION,
  QUALITATIVE_COUNTS,
  RESEARCH_PLOTS,
} from "@/lib/data";

export function PerClassAnalysisSection() {
  const [active, setActive] = useState<(typeof CLASS_NAMES)[number]>(CLASS_NAMES[0]);
  const loc = PER_CLASS_LOCALIZATION[active];

  return (
    <section id="analysis" className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Per-Class Analysis"
            title="Detection Behavior by Defect Type"
            description="Click a class to see its held-out AP, mean IoU, and localization-failure rate — the model does not behave uniformly across all six categories."
          />
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {CLASS_NAMES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                active === c
                  ? "border-accent/40 bg-accent-soft text-foreground"
                  : "border-border text-muted hover:border-border-strong"
              }`}
            >
              {CLASS_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">AP@50:95</div>
            <div className="mt-1 font-tabular text-2xl font-semibold text-accent">
              {(PER_CLASS_AP[active] * 100).toFixed(1)}%
            </div>
          </Card>
          <Card className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">Mean IoU</div>
            <div className="mt-1 font-tabular text-2xl font-semibold text-foreground">
              {loc.meanIoU.toFixed(3)}
            </div>
          </Card>
          <Card className="text-center">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
              Localization Failure Rate
            </div>
            <div className="mt-1 font-tabular text-2xl font-semibold text-warn">
              {(loc.localizationFailureRate * 100).toFixed(1)}%
            </div>
            <div className="mt-1 text-xs text-muted">n = {loc.n} ground-truth objects</div>
          </Card>
        </div>

        <Reveal delay={0.1} className="mt-8">
          <Card>
            <div className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-2">
              AP by Class — held-out test split
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={CLASS_NAMES.map((c) => ({
                    name: CLASS_LABELS[c],
                    AP: Number((PER_CLASS_AP[c] * 100).toFixed(1)),
                    active: c === active,
                  }))}
                  margin={{ top: 4, right: 12, left: -18, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" stroke="#5c6779" tick={{ fontSize: 11, fill: "#8b96a6" }} />
                  <YAxis stroke="#5c6779" tick={{ fontSize: 11, fill: "#8b96a6" }} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#0c1118", border: "1px solid #1b222f", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="AP" radius={[4, 4, 0, 0]} fill="#35e0c2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function ErrorAnalysisSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Error Analysis"
            title="Where the Model Breaks Down"
            description="Automatically categorized examples from the test split, using the same evaluation cache as every metric above."
          />
        </Reveal>

        <RevealStagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <RevealItem>
            <Card className="text-center">
              <Badge tone="default">True Positive</Badge>
              <div className="mt-3 font-tabular text-2xl font-semibold text-foreground">
                {QUALITATIVE_COUNTS.true_positive}
              </div>
              <div className="mt-1 text-xs text-muted">examples captured</div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card className="text-center">
              <Badge tone="default">False Positive</Badge>
              <div className="mt-3 font-tabular text-2xl font-semibold text-foreground">
                {QUALITATIVE_COUNTS.false_positive}
              </div>
              <div className="mt-1 text-xs text-muted">examples captured</div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card className="text-center">
              <Badge tone="fail">False Negative</Badge>
              <div className="mt-3 font-tabular text-2xl font-semibold text-foreground">
                {QUALITATIVE_COUNTS.false_negative}
              </div>
              <div className="mt-1 text-xs text-muted">examples captured</div>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card className="text-center">
              <Badge tone="warn">Poor Localization</Badge>
              <div className="mt-3 font-tabular text-2xl font-semibold text-foreground">
                {QUALITATIVE_COUNTS.poor_localization}
              </div>
              <div className="mt-1 text-xs text-muted">examples captured</div>
            </Card>
          </RevealItem>
        </RevealStagger>

        <Reveal delay={0.1} className="mt-6">
          <Card className="border-border-strong bg-surface-2/80">
            <p className="text-sm leading-relaxed text-muted">
              <strong className="text-foreground">Note on missing categories: </strong>
              the automatic qualitative-example selector captured zero true-positive and zero
              false-positive examples in this run (see{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 text-xs">
                results/metrics/qualitative_summary.json
              </code>
              ). This is reported as-is rather than hidden or substituted with unrelated images —
              the model does still produce true positives (756 at the best-F1 threshold, per the
              Results section), they were simply not among the images the selection logic sampled.
            </p>
          </Card>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                Localization Quality Distribution
              </span>
              <span className="text-xs text-muted">1,307 test-split ground-truth objects</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-[1fr_1fr]">
              <div className="overflow-hidden rounded-lg border border-border">
                <Image
                  src={RESEARCH_PLOTS.localizationQuality}
                  alt="Distribution of IoU quality buckets across ground-truth objects"
                  width={1000}
                  height={667}
                  className="h-auto w-full"
                />
              </div>
              <div className="flex flex-col justify-center gap-3">
                {LOCALIZATION_QUALITY_DISTRIBUTION.map((b) => (
                  <div key={b.bucket} className="flex items-center justify-between border-b border-border pb-2 text-sm">
                    <span className="text-muted">{b.bucket}</span>
                    <span className="font-tabular font-semibold text-foreground">{b.count}</span>
                  </div>
                ))}
                <p className="mt-2 text-xs text-muted">
                  ~23% of ground-truth objects fall below the IoU 0.50 matching threshold used
                  everywhere else on this page — a localization failure even where the class was
                  identified correctly.
                </p>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
