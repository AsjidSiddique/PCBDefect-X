import type { Metadata } from "next";
import { PerClassAnalysisSection, ErrorAnalysisSection } from "@/components/sections/Analysis";

export const metadata: Metadata = {
  title: "Analysis — PCBDefect-X",
  description: "Per-class detection behavior and error analysis on the DeepPCB test split.",
};

export default function AnalysisPage() {
  return (
    <>
      <PerClassAnalysisSection />
      <ErrorAnalysisSection />
    </>
  );
}
