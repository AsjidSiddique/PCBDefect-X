"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Mail, Menu, X } from "lucide-react";
import { RESEARCHER } from "@/lib/data";
import { ROUTES } from "@/lib/routes";

function splitHref(href: string): { path: string; hash: string } {
  const [path, hash = ""] = href.split("#");
  return { path, hash: hash ? `#${hash}` : "" };
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  function isActive(href: string) {
    const { path, hash: routeHash } = splitHref(href);
    if (path !== pathname) return false;
    return routeHash ? hash === routeHash : hash === "";
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "h-14" : "h-20"
        }`}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-accent/40 bg-accent-soft">
            <span className="h-2 w-2 rounded-[2px] bg-accent" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            PCBDefect-X
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {ROUTES.map((r) => {
            const active = isActive(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                className={`relative rounded-md px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {active && (
                  <span className="absolute inset-0 rounded-md border border-accent/30 bg-accent-soft" />
                )}
                <span className="relative">{r.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={RESEARCHER.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Github size={14} /> GitHub
          </a>
          <a
            href={`mailto:${RESEARCHER.links.email}`}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            <Mail size={14} /> Contact
          </a>
        </div>

        <button
          className="rounded-md border border-border p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-1">
            {ROUTES.map((r) => {
              const active = isActive(r.href);
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`rounded-md px-3 py-2 font-mono text-sm uppercase tracking-wider ${
                    active ? "bg-accent-soft text-foreground" : "text-muted"
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
            <a href={RESEARCHER.links.github} target="_blank" rel="noreferrer" className="mt-2 px-3 text-sm text-accent">
              GitHub →
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
