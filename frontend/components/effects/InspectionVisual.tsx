"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * InspectionVisual — PCBDefect-X's signature hero animation.
 *
 * This is deliberately NOT a generic neural-network / particle-brain
 * visualization. It depicts the actual research concept behind DeepPCB:
 * a reference ("template") board is compared against a tested board,
 * a difference region emerges, and the detector locks a bounding box
 * onto it with a class label — the real template→tested→difference→
 * detection pipeline described in the research.
 *
 * Sequence (looped, ~9.5s):
 *  0.0–1.2s   template board fades in
 *  1.2–2.6s   tested board cross-fades in beside it, scan line sweeps
 *  2.6–4.2s   difference heat region appears between the two
 *  4.2–5.6s   bounding box locks onto the difference region
 *  5.6–7.0s   defect label + confidence value appear
 *  7.0–8.2s   detection "locked" state holds
 *  8.2–9.5s   fades out, loop restarts
 */

const STAGES = ["template", "tested", "difference", "detect", "label", "hold"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_DURATIONS_MS: Record<Stage, number> = {
  template: 1100,
  tested: 1400,
  difference: 1500,
  detect: 1300,
  label: 1300,
  hold: 1300,
};

function useStageLoop() {
  const [stage, setStage] = useState<Stage>("template");

  useEffect(() => {
    let idx = 0;
    let timer: ReturnType<typeof setTimeout>;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function next() {
      const current = STAGES[idx % STAGES.length];
      setStage(current);
      const duration = reduceMotion ? 2000 : STAGE_DURATIONS_MS[current];
      idx += 1;
      timer = setTimeout(next, duration);
    }
    next();
    return () => clearTimeout(timer);
  }, []);

  return stage;
}

const TRACE_PATHS = [
  "M20,40 H90 V90 H160",
  "M20,90 H60 V140 H140 V70 H180",
  "M40,150 V60 H120",
  "M160,20 V60 H100 V100",
  "M60,160 H140 V120",
];

function BoardTraces({ opacity = 1 }: { opacity?: number }) {
  return (
    <svg viewBox="0 0 200 180" className="absolute inset-0 h-full w-full" style={{ opacity }}>
      {TRACE_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(53, 224, 194, 0.55)"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      ))}
      {TRACE_PATHS.map((d, i) => {
        const m = d.match(/M([\d.]+),([\d.]+)/);
        if (!m) return null;
        return (
          <circle key={`p-${i}`} cx={m[1]} cy={m[2]} r={2.4} fill="rgba(124,245,223,0.8)" />
        );
      })}
    </svg>
  );
}

export function InspectionVisual() {
  const stage = useStageLoop();
  const stageIndex = STAGES.indexOf(stage);

  const showTested = stageIndex >= 1;
  const showDiff = stageIndex >= 2;
  const showBox = stageIndex >= 3;
  const showLabel = stageIndex >= 4;

  return (
    <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="absolute inset-0 bg-grid-fine opacity-40" />

      {/* HUD header */}
      <div className="absolute left-4 top-4 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
        <span className="status-dot bg-accent" />
        <span>vision.inspect() — template vs tested</span>
      </div>
      <div className="absolute right-4 top-4 z-20 font-mono text-[10px] uppercase tracking-widest text-muted-2">
        {stage}
      </div>

      <div className="relative flex h-full w-full items-center justify-center gap-6 px-8 pb-10 pt-14">
        {/* Template board */}
        <motion.div
          className="relative h-40 w-32 rounded-lg border border-border-strong bg-surface-2 sm:h-48 sm:w-40"
          animate={{ opacity: 1, x: showTested ? -6 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <BoardTraces />
          <span className="absolute -bottom-6 left-0 font-mono text-[9px] uppercase tracking-wider text-muted-2">
            reference
          </span>
        </motion.div>

        {/* Tested board */}
        <motion.div
          className="relative h-40 w-32 overflow-hidden rounded-lg border border-border-strong bg-surface-2 sm:h-48 sm:w-40"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: showTested ? 1 : 0, x: showTested ? 6 : 16 }}
          transition={{ duration: 0.8 }}
        >
          <BoardTraces />
          {/* injected defect mark on tested board */}
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-fail"
            style={{ left: "58%", top: "38%" }}
            animate={{ opacity: showTested ? 1 : 0, scale: showDiff ? [1, 1.4, 1] : 1 }}
            transition={{ duration: 1.2, repeat: showDiff ? Infinity : 0 }}
          />
          {/* scan line */}
          {stage === "tested" && (
            <motion.div
              className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-accent/25 to-transparent"
              initial={{ top: "-20%" }}
              animate={{ top: "110%" }}
              transition={{ duration: 1.3, ease: "linear" }}
            />
          )}
          <span className="absolute -bottom-6 left-0 font-mono text-[9px] uppercase tracking-wider text-muted-2">
            tested
          </span>
        </motion.div>

        {/* Difference / detection overlay, anchored over the tested board's defect point */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute rounded-full"
            style={{
              left: "calc(50% + 6px)",
              top: "38%",
              width: 64,
              height: 64,
              transform: "translate(-14px,-32px)",
              background:
                "radial-gradient(circle, rgba(240,84,106,0.35) 0%, rgba(240,84,106,0) 70%)",
            }}
            animate={{ opacity: showDiff ? 1 : 0, scale: showDiff ? [0.9, 1.05, 0.9] : 0.9 }}
            transition={{ duration: 1.6, repeat: showDiff ? Infinity : 0 }}
          />

          <motion.div
            className="absolute rounded-sm border-2 border-accent"
            style={{
              left: "calc(50% + 6px)",
              top: "38%",
              width: 46,
              height: 34,
              transform: "translate(-23px,-24px)",
              boxShadow: "0 0 16px rgba(53,224,194,0.35)",
            }}
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: showBox ? 1 : 0, scale: showBox ? 1 : 1.3 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div
            className="absolute rounded-md border border-accent/50 bg-surface/95 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-accent-strong shadow-lg"
            style={{
              left: "calc(50% + 6px)",
              top: "38%",
              transform: "translate(24px,-40px)",
            }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: showLabel ? 1 : 0, y: showLabel ? 0 : 6 }}
            transition={{ duration: 0.4 }}
          >
            SHORT · 0.91
          </motion.div>
        </div>
      </div>

      {/* footer status strip */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-surface-2/70 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-2 backdrop-blur">
        <span>iou_match ≥ 0.50</span>
        <span className="text-accent">{showLabel ? "detection locked" : "scanning…"}</span>
      </div>
    </div>
  );
}
