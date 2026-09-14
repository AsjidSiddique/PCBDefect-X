"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * PageTransition — animates between routes when the header-nav switches
 * "pages" (Research / Dataset / Method / Results / Analysis / Deployment /
 * About). Keyed on pathname so Framer Motion treats a route change as a
 * child swap: the outgoing page fades/slides out while the incoming page
 * fades/slides in, instead of a hard cut or a long anchor-scroll.
 *
 * The Navbar and Footer live outside this wrapper (in the root layout) so
 * they never re-animate on navigation — only the page content between them
 * does.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't stomp on hash-anchor navigation (e.g. "/results#live-demo") — only
    // force a scroll-to-top when the destination has no in-page anchor target.
    if (!window.location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    } else {
      const el = document.getElementById(window.location.hash.slice(1));
      el?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
