import { Eye, ScanEye } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/effects/Reveal";
import { Card, SectionHeading } from "@/components/ui/Primitives";
import { RESEARCH_QUESTIONS } from "@/lib/data";

export function ResearchOverview() {
  return (
    <section id="research" className="border-b border-border bg-surface py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Research Motivation"
            title="Why PCB Defect Detection?"
            description="PCB manufacturing defects can be small, visually subtle, and difficult to detect consistently through manual inspection. This project investigates whether modern deep-learning object detection can automatically identify and localize these defects."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal delay={0.05}>
            <Card className="h-full">
              <div className="mb-4 flex items-center gap-2 text-muted">
                <Eye size={18} />
                <span className="font-mono text-xs uppercase tracking-wider">Human Inspection</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Manual visual inspection is slow, subjective, and fatigue-prone at production
                scale. Subtle defects — a hairline mousebite, a faint spur, a small pinhole —
                are easy to miss under time pressure, and inspection quality varies between
                operators and shifts.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="h-full border-accent/20 bg-accent-soft/40">
              <div className="mb-4 flex items-center gap-2 text-accent">
                <ScanEye size={18} />
                <span className="font-mono text-xs uppercase tracking-wider">Automated Computer Vision</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                An object detector trained on labeled template-vs-tested PCB pairs learns to
                consistently localize six categories of defect at a fixed decision threshold —
                trading manual variability for a measurable, reproducible precision/recall
                operating point (see Results).
              </p>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ResearchQuestionsSection() {
  return (
    <section className="border-b border-border bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="mb-14 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-2">
              Research Question
            </span>
            <h2 className="mx-auto mt-4 max-w-3xl text-balance text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              &ldquo;How effectively can a deep-learning object detector identify and localize PCB
              manufacturing defects, and where does its performance break down across defect
              categories and deployment backends?&rdquo;
            </h2>
          </div>
        </Reveal>

        <RevealStagger className="grid gap-4 sm:grid-cols-2">
          {RESEARCH_QUESTIONS.map((rq) => (
            <RevealItem key={rq.id}>
              <Card className="h-full">
                <span className="font-mono text-xs text-accent">{rq.id}</span>
                <h3 className="mt-1 text-base font-semibold text-foreground">{rq.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{rq.body}</p>
              </Card>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
