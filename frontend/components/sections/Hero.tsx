"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Github, PlayCircle } from "lucide-react";
import { CircuitField } from "@/components/effects/CircuitField";
import { InspectionVisual } from "@/components/effects/InspectionVisual";
import { PROJECT, RESEARCHER } from "@/lib/data";

const META = [
  { label: "Dataset", value: "DeepPCB" },
  { label: "Task", value: "Object Detection" },
  { label: "Model", value: "RF-DETR Nano" },
  { label: "Stack", value: "Python / PyTorch" },
  { label: "Status", value: "Research Build" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <CircuitField />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent"
          >
            <span className="h-px w-8 bg-accent/50" />
            Deep Learning × Computer Vision
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {PROJECT.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 text-xl font-medium text-muted sm:text-2xl"
          >
            Deep Learning for PCB Manufacturing{" "}
            <span className="text-gradient-lab">Defect Detection & Localization</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-muted"
          >
            An end-to-end computer vision research system for detecting and localizing
            manufacturing defects on printed circuit boards — from a validated dataset pipeline,
            through RF-DETR training and held-out evaluation, to a deployment-gated export stack.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Explore Research
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/results#live-demo"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 px-5 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent-soft"
            >
              <PlayCircle size={15} /> Try Live Detection
            </Link>
            <Link
              href="/results"
              className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
            >
              View Results
            </Link>
            <a
              href={RESEARCHER.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:text-foreground"
            >
              <Github size={15} /> GitHub
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-border pt-6 sm:grid-cols-5"
          >
            {META.map((m) => (
              <div key={m.label}>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
                  {m.label}
                </div>
                <div className="mt-1 text-sm font-medium text-foreground">{m.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <InspectionVisual />
        </motion.div>
      </div>

      <div className="relative border-t border-border bg-surface/60 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 font-mono text-[10px] uppercase tracking-widest text-muted-2">
          <span>CV Pipeline: Image → Features → Detection → Localization</span>
          <span className="text-border-strong">/</span>
          <span>Model: RF-DETR Nano</span>
          <span className="text-border-strong">/</span>
          <span>Data: DeepPCB</span>
          <span className="text-border-strong">/</span>
          <span>Task: Object Detection</span>
        </div>
      </div>
    </section>
  );
}
