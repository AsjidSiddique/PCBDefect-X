import type { Metadata } from "next";
import { DeploymentSection } from "@/components/sections/Deployment";
import {
  EngineeringSection,
  ReproducibilityIntegritySection,
  LimitationsSection,
} from "@/components/sections/Engineering";

export const metadata: Metadata = {
  title: "Deployment — PCBDefect-X",
  description: "ONNX / INT8 / TensorRT acceptance gates, engineering architecture, and limitations.",
};

export default function DeploymentPage() {
  return (
    <>
      <DeploymentSection />
      <EngineeringSection />
      <ReproducibilityIntegritySection />
      <LimitationsSection />
    </>
  );
}
