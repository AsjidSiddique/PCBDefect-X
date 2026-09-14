"use client";

import { useEffect, useRef } from "react";

/**
 * CircuitField — an ambient canvas background depicting a sparse PCB trace
 * network: orthogonal (Manhattan-routed) traces connect small pad nodes,
 * a slow scan pulse occasionally travels along a trace the way a signal
 * would propagate on a real board, and the whole field drifts by a couple
 * of pixels in response to cursor movement. This is the signature
 * PCBDefect-X background — distinct from a generic particle/starfield
 * system, and distinct from the transaction-graph animation used in a
 * previous unrelated project.
 */

interface Pad {
  x: number;
  y: number;
}

interface Trace {
  from: Pad;
  to: Pad;
  bend: Pad; // orthogonal bend point
}

interface Pulse {
  traceIndex: number;
  t: number;
  speed: number;
  reverse: boolean;
}

export function CircuitField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isSmall = window.matchMedia("(max-width: 768px)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pads: Pad[] = [];
    let traces: Trace[] = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let offsetX = 0;
    let offsetY = 0;
    let targetOffsetX = 0;
    let targetOffsetY = 0;

    function buildNetwork(w: number, h: number) {
      const cell = isSmall ? 140 : 100;
      const cols = Math.ceil(w / cell) + 1;
      const rows = Math.ceil(h / cell) + 1;
      const grid: Pad[][] = [];
      for (let r = 0; r <= rows; r++) {
        const row: Pad[] = [];
        for (let c = 0; c <= cols; c++) {
          const jitter = cell * 0.28;
          row.push({
            x: c * cell + (Math.random() - 0.5) * jitter,
            y: r * cell + (Math.random() - 0.5) * jitter,
          });
        }
        grid.push(row);
      }
      pads = grid.flat();
      const newTraces: Trace[] = [];
      const density = isSmall ? 0.22 : 0.3;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (c < cols && Math.random() < density) {
            const a = grid[r][c];
            const b = grid[r][c + 1];
            newTraces.push({ from: a, to: b, bend: { x: b.x, y: a.y } });
          }
          if (r < rows && Math.random() < density) {
            const a = grid[r][c];
            const b = grid[r + 1][c];
            newTraces.push({ from: a, to: b, bend: { x: a.x, y: b.y } });
          }
        }
      }
      traces = newTraces;
      pulses = [];
    }

    function resize() {
      const el = canvas as HTMLCanvasElement;
      width = el.clientWidth;
      height = el.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork(width, height);
    }

    function traceLength(t: Trace) {
      const l1 = Math.hypot(t.bend.x - t.from.x, t.bend.y - t.from.y);
      const l2 = Math.hypot(t.to.x - t.bend.x, t.to.y - t.bend.y);
      return l1 + l2;
    }

    function pointOnTrace(t: Trace, progress: number) {
      const l1 = Math.hypot(t.bend.x - t.from.x, t.bend.y - t.from.y);
      const total = traceLength(t);
      const dist = progress * total;
      if (dist <= l1) {
        const f = l1 === 0 ? 0 : dist / l1;
        return { x: t.from.x + (t.bend.x - t.from.x) * f, y: t.from.y + (t.bend.y - t.from.y) * f };
      }
      const l2 = total - l1;
      const f = l2 === 0 ? 0 : (dist - l1) / l2;
      return { x: t.bend.x + (t.to.x - t.bend.x) * f, y: t.bend.y + (t.to.y - t.bend.y) * f };
    }

    function maybeSpawnPulse() {
      if (reduceMotion) return;
      if (pulses.length > 4 || traces.length === 0) return;
      if (Math.random() > 0.012) return;
      pulses.push({
        traceIndex: Math.floor(Math.random() * traces.length),
        t: 0,
        speed: 0.006 + Math.random() * 0.006,
        reverse: Math.random() > 0.5,
      });
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      offsetX += (targetOffsetX - offsetX) * 0.03;
      offsetY += (targetOffsetY - offsetY) * 0.03;
      ctx.save();
      ctx.translate(offsetX, offsetY);

      // traces
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(53, 224, 194, 0.09)";
      for (const t of traces) {
        ctx.beginPath();
        ctx.moveTo(t.from.x, t.from.y);
        ctx.lineTo(t.bend.x, t.bend.y);
        ctx.lineTo(t.to.x, t.to.y);
        ctx.stroke();
      }

      // pads
      for (const p of pads) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(139, 150, 166, 0.18)";
        ctx.fill();
      }

      // pulses
      if (!reduceMotion) {
        maybeSpawnPulse();
        pulses = pulses.filter((p) => p.t <= 1);
        for (const p of pulses) {
          const t = traces[p.traceIndex];
          if (!t) continue;
          const progress = p.reverse ? 1 - p.t : p.t;
          const pt = pointOnTrace(t, progress);
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 7);
          grad.addColorStop(0, "rgba(124, 245, 223, 0.9)");
          grad.addColorStop(1, "rgba(124, 245, 223, 0)");
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
          p.t += p.speed;
        }
      }

      ctx.restore();
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    function handleMouse(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetOffsetX = -nx * 6;
      targetOffsetY = -ny * 6;
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    }

    resize();
    loop();
    window.addEventListener("resize", resize);
    if (!isSmall) window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
    />
  );
}
