import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "accent" | "warn" | "fail" | "ok" }) {
  const tones: Record<string, string> = {
    default: "border-border text-muted bg-surface-2",
    accent: "border-accent/30 text-accent bg-accent-soft",
    ok: "border-ok/30 text-ok bg-accent-soft",
    warn: "border-warn/30 text-warn bg-[rgba(240,180,41,0.08)]",
    fail: "border-fail/30 text-fail bg-[rgba(240,84,106,0.08)]",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: "accepted" | "rejected" | "unavailable" | "exploratory" | "not-evaluated" }) {
  const map = {
    accepted: { label: "Accepted", tone: "ok" as const },
    rejected: { label: "Rejected", tone: "fail" as const },
    unavailable: { label: "Unavailable", tone: "default" as const },
    exploratory: { label: "Exploratory", tone: "warn" as const },
    "not-evaluated": { label: "Not Yet Evaluated", tone: "default" as const },
  };
  const cfg = map[status];
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
      <span className="h-px w-8 bg-accent/50" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <SectionEyebrow>{eyebrow}</SectionEyebrow>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-2xl text-balance text-muted">{description}</p>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-border bg-surface-2/60 p-6 backdrop-blur-sm transition-colors hover:border-border-strong",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  suffix,
  note,
}: {
  label: string;
  value: string;
  suffix?: string;
  note?: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-2">{label}</span>
      <span className="font-tabular text-3xl font-semibold text-foreground">
        {value}
        {suffix && <span className="ml-1 text-base font-normal text-muted">{suffix}</span>}
      </span>
      {note && <span className="text-xs text-muted">{note}</span>}
    </Card>
  );
}
