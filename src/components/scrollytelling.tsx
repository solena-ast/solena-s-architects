import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scene — wraps a section that acts as a cinematic scrollytelling stage.
 * Layers inside use `data-scene-layer` attributes to receive scrub animations.
 *
 *   layer attrs:
 *     data-scene-layer="bg"    → slow parallax + scale out
 *     data-scene-layer="image" → mid parallax + fade in / out
 *     data-scene-layer="text"  → upward drift + opacity arc
 *     data-scene-layer="pin"   → element pinned during scene duration
 */
export function Scene({
  children,
  className = "",
  height = "180vh",
  id,
}: {
  children: ReactNode;
  className?: string;
  height?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const bgs = root.querySelectorAll<HTMLElement>('[data-scene-layer="bg"]');
      const imgs = root.querySelectorAll<HTMLElement>('[data-scene-layer="image"]');
      const texts = root.querySelectorAll<HTMLElement>('[data-scene-layer="text"]');
      const pins = root.querySelectorAll<HTMLElement>('[data-scene-layer="pin"]');

      // Background slow drift
      bgs.forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6, scale: 1.08 },
          {
            yPercent: 6,
            scale: 1.0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Image parallax + fade
      imgs.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 14, opacity: 0, scale: 1.04 },
          {
            yPercent: -10,
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "bottom 10%",
              scrub: 1,
            },
          },
        );
        // Subtle clip reveal on first paint
        gsap.fromTo(
          el,
          { clipPath: "inset(8% 12% 8% 12% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 18px)",
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            delay: i * 0.08,
          },
        );
      });

      // Text upward drift + opacity arc
      texts.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        );
      });

      // Pin the stage of a scene
      pins.forEach((el) => {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          pin: el,
          pinSpacing: false,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref as never}
      id={id}
      className={`scrollytelling-scene ${className}`}
      style={{ minHeight: height }}
    >
      {children}
    </section>
  );
}

/**
 * AmbientVideo — autoplaying muted video used as ambient visual layer.
 * Lazy-mounts when in view; pauses when offscreen for battery + bandwidth.
 */
export function AmbientVideo({
  src,
  poster,
  className = "",
  objectPosition = "center",
}: {
  src: string;
  poster?: string;
  className?: string;
  objectPosition?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        }
      },
      { threshold: 0.1 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`ambient-video ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      style={{ objectPosition }}
      aria-hidden="true"
    />
  );
}

/**
 * SacredLine — rare signature italic moment. Reckless / Ivar substitute.
 */
export function SacredLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`sacred-line ${className}`}>{children}</span>;
}
