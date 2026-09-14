import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { OTHER_PROJECTS, RESEARCHER } from "@/lib/data";

export function ResearcherSection() {
  return (
    <section id="about" className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading eyebrow="About the Researcher" title={RESEARCHER.name} />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Card>
            <div className="grid gap-8 sm:grid-cols-[1fr_1.4fr]">
              <div>
                <div className="mb-5 flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border-strong">
                    <Image
                      src={RESEARCHER.avatarUrl}
                      alt={RESEARCHER.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{RESEARCHER.role}</div>
                    <div className="mt-1 text-sm text-accent">{RESEARCHER.subrole}</div>
                  </div>
                </div>
                <div className="mt-4 space-y-1 text-sm text-muted">
                  <div>{RESEARCHER.education}</div>
                  <div>CGPA: {RESEARCHER.cgpa}</div>
                  <div>Expected Graduation: {RESEARCHER.expectedGraduation}</div>
                </div>
                <div className="mt-6 flex gap-3">
                  <a href={RESEARCHER.links.github} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 text-muted hover:text-foreground">
                    <Github size={16} />
                  </a>
                  <a href={RESEARCHER.links.linkedin} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 text-muted hover:text-foreground">
                    <Linkedin size={16} />
                  </a>
                  <a href={`mailto:${RESEARCHER.links.email}`} className="rounded-md border border-border p-2 text-muted hover:text-foreground">
                    <Mail size={16} />
                  </a>
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
                  Research Interests
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {RESEARCHER.interests.map((i) => (
                    <span key={i} className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted">
                      {i}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {Object.entries(RESEARCHER.skills).map(([group, items]) => (
                    <div key={group}>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-2">
                        {group === "aiMl" ? "AI / ML" : group === "softwareEngineering" ? "Software Eng." : "Programming"}
                      </div>
                      <ul className="mt-2 space-y-1 text-xs text-muted">
                        {items.map((it) => (
                          <li key={it}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export function OtherProjectsSection() {
  return (
    <section className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading eyebrow="More Work" title="Other Projects" />
        </Reveal>

        <RevealStagger className="mt-12 grid gap-4 sm:grid-cols-2">
          {OTHER_PROJECTS.map((p) => (
            <RevealItem key={p.name}>
              <a href={p.url} target="_blank" rel="noreferrer" className="block h-full">
                <Card className="group h-full">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-foreground">{p.name}</h4>
                      <span className="mt-1 inline-block rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-2">
                        {p.tag}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-muted-2 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.description}</p>
                </Card>
              </a>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="relative overflow-hidden bg-background py-28">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Explore the Research
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            PCBDefect-X is an ongoing research and engineering project.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Every figure on this page traces back to a real result file — read the notebook,
            inspect the deployment registry, or reach out directly.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={RESEARCHER.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            <Github size={15} /> View GitHub
          </a>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            Explore Results
          </Link>
          <a
            href={RESEARCHER.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border-strong px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Linkedin size={15} /> Connect on LinkedIn
          </a>
          <a
            href={`mailto:${RESEARCHER.links.email}`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm text-muted hover:text-foreground"
          >
            <Mail size={15} /> Email Me
          </a>
        </Reveal>
      </div>
    </section>
  );
}
