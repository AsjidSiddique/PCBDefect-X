import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LoadingScreen } from "@/components/effects/LoadingScreen";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://pcbdefect-x.example.com"),
  title: "PCBDefect-X — Deep Learning for PCB Defect Detection",
  description:
    "PCBDefect-X is a deep-learning computer vision research project for detecting and localizing PCB manufacturing defects using object detection (RF-DETR Nano on DeepPCB).",
  openGraph: {
    title: "PCBDefect-X — Deep Learning for PCB Defect Detection",
    description:
      "An end-to-end computer vision research system for detecting and localizing manufacturing defects on printed circuit boards.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "PCBDefect-X — Deep Learning for PCB Defect Detection",
    description:
      "An end-to-end computer vision research system for detecting and localizing manufacturing defects on printed circuit boards.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LoadingScreen />
        <Navbar />
        <PageTransition>
          <main className="pt-14 lg:pt-20">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  );
}
