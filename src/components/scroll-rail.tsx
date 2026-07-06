import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Vertical scroll-position rail fixed to the right edge — global,
 * present across every page and device. Subtle, non-interactive.
 */
export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <div className="scroll-rail" aria-hidden="true">
      <span className="scroll-rail-track" />
      <span
        className="scroll-rail-fill"
        style={{ transform: `scaleY(${progress})` }}
      />
      <span className="scroll-rail-caret" style={{ top: `${progress * 100}%` }} />
    </div>
  );
}
