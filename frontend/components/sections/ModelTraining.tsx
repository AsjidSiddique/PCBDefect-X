"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { PROJECT, TRAINING_CONFIG, TRAINING_CURVE, TRAINING_HARDWARE } from "@/lib/data";

const MODEL_FLOW = ["Input Image", "Backbone / Features", "Detection Transformer", "Object Queries", "Bounding Boxes", "Class Predictions"];

export function ModelSection() {
  return (
    <section id="method" className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="The Model"
            title={PROJECT.model}
            description="RF-DETR is a real-time detection-transformer architecture. This project fine-tunes the Nano variant (rfdetr==1.9.4) directly on DeepPCB's six defect classes at a 384×384 export resolution / 544px training resolution."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <Card className="overflow-x-auto">
            <div className="flex min-w-max items-center gap-3 py-2">
              {MODEL_FLOW.map((stage, i) => (
                <div key={stage} className="flex items-center gap-3">
                  <div className="rounded-lg border border-border bg-surface px-4 py-3 text-center">
                    <span className="whitespace-nowrap text-sm font-medium text-foreground">{stage}</span>
                  </div>
                  {i < MODEL_FLOW.length - 1 && <ArrowRight size={16} className="text-border-strong" />}
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        <RevealStagger className="mt-8 grid gap-6 sm:grid-cols-3">
          <RevealItem>
            <Card>
              <h4 className="text-sm font-semibold text-foreground">Why RF-DETR Nano</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A lightweight real-time detection-transformer variant, chosen to keep the full
                train → export → deployment-gate loop (ONNX / INT8 / TensorRT) tractable on a
                single T4 GPU within a Colab research session.
              </p>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <h4 className="text-sm font-semibold text-foreground">Input / Output</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Input: a single {PROJECT.imageSize}×{PROJECT.imageSize} RGB PCB image. Output: a
                set of object queries decoded into bounding boxes with a per-box class
                distribution over the six defect categories and a confidence score.
              </p>
            </Card>
          </RevealItem>
          <RevealItem>
            <Card>
              <h4 className="text-sm font-semibold text-foreground">Matching Protocol</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Evaluation uses class-aware ground-truth matching at IoU ≥ {PROJECT.iouMatchThreshold}:
                a prediction only counts as correct if both the predicted class and box overlap
                are right — matching the training config exactly.
              </p>
            </Card>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}

const chartData = TRAINING_CURVE.map((d) => ({
  epoch: d.epoch,
  "mAP@50": Number((d.map50 * 100).toFixed(1)),
  "mAP@50:95": Number((d.map5095 * 100).toFixed(1)),
  Precision: Number((d.precision * 100).toFixed(1)),
  Recall: Number((d.recall * 100).toFixed(1)),
}));

export function TrainingSection() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Training The Model"
            title="20 Epochs on a Single T4"
            description="Validation metrics logged every 2 epochs directly from the training run — read from checkpoints/deeppcb_run/metrics.csv, not re-derived."
          />
        </Reveal>

        <RevealStagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Framework", value: "PyTorch / RF-DETR" },
            { label: "Epochs", value: String(TRAINING_CONFIG.epochs) },
            { label: "Batch Size", value: `${TRAINING_CONFIG.batchSize} × ${TRAINING_CONFIG.gradAccumSteps} accum` },
            { label: "Learning Rate", value: TRAINING_CONFIG.lr.toString() },
            { label: "EMA Decay", value: TRAINING_CONFIG.emaDecay.toString() },
            { label: "Early Stop Patience", value: `${TRAINING_CONFIG.earlyStoppingPatience} evals` },
            { label: "GPU", value: `${TRAINING_HARDWARE.name} (${TRAINING_HARDWARE.vramGb} GB)` },
            { label: "Multi-Scale Aug.", value: TRAINING_CONFIG.multiScale ? "Enabled" : "Disabled" },
          ].map((c) => (
            <RevealItem key={c.label}>
              <Card className="text-center">
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">{c.label}</div>
                <div className="mt-1 font-tabular text-sm font-semibold text-foreground">{c.value}</div>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.1} className="mt-10">
          <Card>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-2">
                Validation Curves (mAP@50, mAP@50:95, Precision, Recall)
              </span>
              <span className="text-xs text-muted">Source: checkpoints/deeppcb_run/metrics.csv</span>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="epoch"
                    stroke="#5c6779"
                    tick={{ fontSize: 11, fill: "#8b96a6" }}
                    label={{ value: "Epoch", position: "insideBottom", offset: -2, fill: "#5c6779", fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#5c6779"
                    tick={{ fontSize: 11, fill: "#8b96a6" }}
                    domain={[0, 100]}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#0c1118",
                      border: "1px solid #1b222f",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#8b96a6" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="mAP@50" stroke="#35e0c2" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="mAP@50:95" stroke="#4f8cff" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Precision" stroke="#f0b429" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                  <Line type="monotone" dataKey="Recall" stroke="#f0546a" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
