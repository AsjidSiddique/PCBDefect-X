"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["DATA", "MODEL", "PIPELINE", "RESULTS"];

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(false);
      return;
    }
    const start = Date.now();
    const duration = 850;
    const raf = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) requestAnimationFrame(raf);
      else setTimeout(() => setVisible(false), 150);
    };
    requestAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          <div className="font-mono text-sm font-semibold tracking-tight text-foreground">
            PCBDefect-X
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-2">
            Initializing Vision System…
          </div>
          <div className="mt-6 h-1 w-56 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 flex gap-4 font-mono text-[9px] uppercase tracking-wider text-muted-2">
            {STEPS.map((s, i) => (
              <span key={s} className={progress > (i / STEPS.length) * 100 ? "text-accent" : ""}>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
