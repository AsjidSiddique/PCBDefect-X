import type { Metadata } from "next";
import { DatasetSection, DefectTaxonomy } from "@/components/sections/Dataset";

export const metadata: Metadata = {
  title: "Dataset — PCBDefect-X",
  description: "DeepPCB dataset statistics, splits, and the six PCB defect classes.",
};

export default function DatasetPage() {
  return (
    <>
      <DatasetSection />
      <DefectTaxonomy />
    </>
  );
}
