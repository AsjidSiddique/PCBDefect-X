import type { Metadata } from "next";
import { FutureWorkSection, ConclusionSection } from "@/components/sections/FutureConclusion";
import { ResearcherSection, OtherProjectsSection, FinalCTASection } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "About — PCBDefect-X",
  description: "Future work, research conclusions, and the researcher behind PCBDefect-X.",
};

export default function AboutPage() {
  return (
    <>
      <FutureWorkSection />
      <ConclusionSection />
      <ResearcherSection />
      <OtherProjectsSection />
      <FinalCTASection />
    </>
  );
}
