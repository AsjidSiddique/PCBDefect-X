"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";

const STAGES = [
  { label: "Reference PCB", detail: "Known-good template board" },
  { label: "Tested PCB", detail: "Board under inspection" },
  { label: "Image Difference", detail: "Pixel-level deviation region" },
  { label: "Defect Region", detail: "Candidate area of interest" },
  { label: "Detection", detail: "Classified, localized defect" },
];

export function TemplateVsTestedSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Signature Concept"
            title="Template → Tested → Difference → Detection"
            description="DeepPCB is built from reference (template) and tested PCB image pairs. This structure — comparing a known-good board against the board under inspection — is the conceptual backbone of the whole detection pipeline."
          />
        </Reveal>

        <div className="mt-16 flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-2">
          {STAGES.map((s, i) => (
            <RevealStagger key={s.label} className="contents">
              <RevealItem className="flex flex-1 flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-3 text-sm font-medium text-foreground">{s.label}</div>
                <div className="mt-1 max-w-[9rem] text-xs text-muted">{s.detail}</div>
              </RevealItem>
              {i < STAGES.length - 1 && (
                <div className="flex items-center justify-center text-muted-2 md:mx-1">
                  <ArrowRight size={16} className="hidden md:block" />
                  <ArrowDown size={16} className="md:hidden" />
                </div>
              )}
            </RevealStagger>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-16">
          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  title: "Reference vs Tested",
                  body: "Each DeepPCB sample pairs a defect-free template image with a tested image of the same board region under inspection.",
                },
                {
                  title: "Difference-Driven Labels",
                  body: "Ground-truth defect boxes mark exactly where the tested board deviates from its template — the annotation protocol this project trains against.",
                },
                {
                  title: "Detector as Difference Model",
                  body: "RF-DETR Nano is trained to reproduce that same judgment directly from the tested image: classify and localize the six defect types without needing the template at inference time.",
                },
              ].map((b) => (
                <div key={b.title} className="p-6">
                  <h4 className="text-sm font-semibold text-foreground">{b.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{b.body}</p>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function PipelineDiagram({
  title,
  eyebrow,
  description,
  stages,
}: {
  title: string;
  eyebrow: string;
  description: string;
  stages: { label: string; detail: string }[];
}) {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>

        <div className="mt-14 overflow-x-auto">
          <div className="flex min-w-max items-stretch gap-3 px-1 pb-2">
            {stages.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <Card className="w-40 shrink-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 text-sm font-medium text-foreground">{s.label}</div>
                  <div className="mt-1 text-xs leading-snug text-muted">{s.detail}</div>
                </Card>
                {i < stages.length - 1 && (
                  <ArrowRight size={16} className="shrink-0 text-border-strong" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
