import type { Metadata } from "next";
import { ResearchOverview, ResearchQuestionsSection } from "@/components/sections/ResearchOverview";
import { TemplateVsTestedSection, PipelineDiagram } from "@/components/sections/TemplatePipeline";

export const metadata: Metadata = {
  title: "Research — PCBDefect-X",
  description: "Research motivation, questions, and the template-vs-tested detection concept behind PCBDefect-X.",
};

const DATA_PIPELINE_STAGES = [
  { label: "Raw Data", detail: "DeepPCB, downloaded programmatically via kagglehub" },
  { label: "Data Validation", detail: "Leakage checks, hash verification, annotation validity gate" },
  { label: "Annotation Processing", detail: "Deterministic conversion to YOLO-format boxes" },
  { label: "Train / Valid / Test", detail: "2,772 / 366 / 366 images, seed = 42" },
  { label: "Augmentation", detail: "Multi-scale training augmentation" },
  { label: "Model Training", detail: "RF-DETR Nano, 20 epochs, single T4 GPU" },
  { label: "Evaluation", detail: "Held-out test-split mAP / precision / recall / F1" },
  { label: "Inference", detail: "Class-aware, IoU-matched prediction cache" },
  { label: "Research Results", detail: "Metrics, plots, qualitative examples" },
];

export default function ResearchPage() {
  return (
    <>
      <ResearchOverview />
      <ResearchQuestionsSection />
      <TemplateVsTestedSection />
      <PipelineDiagram
        eyebrow="Data Pipeline"
        title="From Raw Images to Research Results"
        description="Every stage below corresponds to an actual step the training notebook executes, in order."
        stages={DATA_PIPELINE_STAGES}
      />
    </>
  );
}
