import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { RESEARCHER } from "@/lib/data";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-surface">
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-8 w-full opacity-40"
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,20 H200 V5 H420 V35 H700 V15 H900 V25 H1200"
          fill="none"
          stroke="rgba(53,224,194,0.4)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-accent/40 bg-accent-soft">
                <span className="h-2 w-2 rounded-[2px] bg-accent" />
              </span>
              <span className="font-mono text-sm font-semibold text-foreground">PCBDefect-X</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Deep Learning × Computer Vision — PCB defect detection and localization. Built as an
              independent research and engineering project.
            </p>
            <p className="mt-6 text-xs text-muted-2">© 2026 {RESEARCHER.name}. Research build.</p>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-2">Research</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link href="/dataset" className="hover:text-foreground">Dataset</Link></li>
              <li><Link href="/method" className="hover:text-foreground">Model & Method</Link></li>
              <li><Link href="/results" className="hover:text-foreground">Results</Link></li>
              <li><Link href="/deployment" className="hover:text-foreground">Deployment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted-2">Connect</h4>
            <ul className="mt-3 space-y-3 text-sm text-muted">
              <li>
                <a href={RESEARCHER.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <Github size={14} /> GitHub
                </a>
              </li>
              <li>
                <a href={RESEARCHER.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <Linkedin size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${RESEARCHER.links.email}`} className="flex items-center gap-2 hover:text-foreground">
                  <Mail size={14} /> Email
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
