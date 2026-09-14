"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { ROUTES } from "@/lib/routes";

const DESCRIPTIONS: Record<string, string> = {
  "/research": "Motivation, research questions, and the template-vs-tested detection concept.",
  "/dataset": "DeepPCB stats, splits, and the six defect classes.",
  "/method": "RF-DETR Nano architecture and the real training curves.",
  "/results": "Held-out test metrics, PR curve, and a live detection playground.",
  "/analysis": "Per-class behavior and where detection breaks down.",
  "/deployment": "ONNX / INT8 / TensorRT acceptance gates and engineering architecture.",
  "/about": "Future work, conclusions, and the researcher behind the project.",
};

export function QuickNavGrid() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Explore"
          title="Navigate the Research"
          description="Each section below is its own page — click through instead of scrolling."
        />

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ROUTES.map((r) => (
            <RevealItem key={r.href}>
              <Link href={r.href} className="block h-full">
                <Card className="group h-full">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">
                      {r.label}
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {DESCRIPTIONS[r.href]}
                  </p>
                </Card>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
