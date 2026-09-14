import type { Metadata } from "next";
import { ModelSection, TrainingSection } from "@/components/sections/ModelTraining";

export const metadata: Metadata = {
  title: "Method — PCBDefect-X",
  description: "RF-DETR Nano architecture and the real training curves from the DeepPCB fine-tuning run.",
};

export default function MethodPage() {
  return (
    <>
      <ModelSection />
      <TrainingSection />
    </>
  );
}
