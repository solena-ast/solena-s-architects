import { useEffect, useRef, useState } from "react";

export type SectionEntry = { id: string; label: string };

export function SectionNav({ sections }: { sections: SectionEntry[] }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef<number | null>(null);

  const goTo = (index: number) => {
    const i = Math.max(0, Math.min(sections.length - 1, index));
    const el = document.getElementById(sections[i].id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Track active section + scroll progress
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = sections.findIndex((s) => s.id === visible.target.id);
          if (idx >= 0) setActive(idx);
        }
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -40% 0px" },
    );
    els.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === "j") {
        e.preventDefault();
        goTo(active + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k") {
        e.preventDefault();
        goTo(active - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(sections.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, sections.length]);

  // Touch swipe (vertical)
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0]?.clientY ?? null;
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStart.current == null) return;
      const end = e.changedTouches[0]?.clientY ?? touchStart.current;
      const delta = touchStart.current - end;
      touchStart.current = null;
      // Only treat as section swipe when starting on the nav rail
      const t = e.target as HTMLElement | null;
      if (!t?.closest?.("[data-section-rail]")) return;
      if (Math.abs(delta) < 40) return;
      goTo(active + (delta > 0 ? 1 : -1));
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [active]);

  return (
    <>
      <div className="section-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>

      <nav
        className="section-nav"
        aria-label="Section navigation"
        data-section-rail
      >
        <ol>
          {sections.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                aria-label={`Go to ${s.label}`}
                className={i === active ? "is-active" : ""}
              >
                <span className="dot" />
                <span className="label">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <span className="name">{s.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <p className="section-nav-hint" aria-hidden="true">
          ↑ ↓ to navigate
        </p>
      </nav>
    </>
  );
}

/**
 * AnimatedLines — splits children text into words and reveals them in sequence
 * once the block enters the viewport. Use for hero / thesis / standard copy.
 */
export function AnimatedLines({
  children,
  as: As = "p",
  className = "",
  delay = 0,
  stagger = 60,
}: {
  children: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = children.split(" ");
  return (
    <As
      ref={ref as never}
      className={`animated-lines ${visible ? "is-in" : ""} ${className}`.trim()}
    >
      {words.map((w, i) => (
        <span key={i} className="word">
          <span
            className="word-inner"
            style={{ transitionDelay: `${delay + i * stagger}ms` }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </As>
  );
}
