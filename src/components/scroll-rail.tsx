import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Vertical scroll-position rail fixed to the right edge.
 * - rAF-throttled for accuracy under fast scroll
 * - Recomputes on route change, resize, and DOM mutation
 * - Ticks per <section> for readable orientation
 * - Non-intrusive: 1px track, pointer-events: none, respects safe-area
 */
export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [ticks, setTicks] = useState<number[]>([]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      frame.current = null;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    const schedule = () => {
      if (frame.current != null) return;
      frame.current = requestAnimationFrame(compute);
    };

    const measureTicks = () => {
      const total = document.documentElement.scrollHeight;
      if (total <= 0) return;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("section, [data-rail-tick]"));
      const seen = new Set<number>();
      const next: number[] = [];
      for (const node of nodes) {
        const top = node.getBoundingClientRect().top + window.scrollY;
        const pct = Math.round((top / total) * 1000) / 10; // one decimal
        if (pct <= 0 || pct >= 100) continue;
        if (seen.has(pct)) continue;
        seen.add(pct);
        next.push(pct);
      }
      setTicks(next);
    };

    compute();
    measureTicks();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", () => {
      schedule();
      measureTicks();
    });

    const mo = new MutationObserver(() => {
      schedule();
      measureTicks();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      if (frame.current != null) cancelAnimationFrame(frame.current);
      mo.disconnect();
    };
  }, [pathname]);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <span className="scroll-rail-track" />
      <span className="scroll-rail-fill" style={{ transform: `scaleY(${progress})` }} />
      {ticks.map((t) => (
        <span key={t} className="scroll-rail-tick" style={{ top: `${t}%` }} />
      ))}
      <span className="scroll-rail-caret" style={{ top: `${progress * 100}%` }} />
    </div>
  );
}
