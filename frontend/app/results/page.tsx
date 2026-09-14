import type { Metadata } from "next";
import { ResultsSection } from "@/components/sections/Results";
import { LiveDetectionSection } from "@/components/sections/LiveDetection";

export const metadata: Metadata = {
  title: "Results — PCBDefect-X",
  description: "Held-out test metrics, PR curve, and a live RF-DETR detection playground.",
};

export default function ResultsPage() {
  return (
    <>
      <ResultsSection />
      <LiveDetectionSection />
    </>
  );
}
