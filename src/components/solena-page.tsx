import { useEffect, useMemo, useRef, useState } from "react";

import { SectionNav, AnimatedLines, type SectionEntry } from "@/components/section-nav";
import { Scene, AmbientVideo, SacredLine } from "@/components/scrollytelling";
import solenaLogo from "@/assets/solena-logo-removebg-preview.png.asset.json";
import solenaWordmark from "@/assets/solena-wordmark.png.asset.json";
import spiralLandscape from "@/assets/spiral.png.asset.json";
import spiralPortrait from "@/assets/spiral-potrait.png.asset.json";
import gravityLandscape from "@/assets/gravity-1.1.png.asset.json";
import gravityPortrait from "@/assets/gravity-1.1-potrait.png.asset.json";
import haloLandscape from "@/assets/vie-halo-1.png.asset.json";
import haloPortrait from "@/assets/vie-potrait.png.asset.json";
import futureLandscape from "@/assets/Gemini_Generated_Image_ttgdtyttgdtyttgd.png.asset.json";
import futurePortrait from "@/assets/resonance-2-potrait.png.asset.json";
import invitationPortrait from "@/assets/g-01.1-potrait.png.asset.json";

// New assets
import gWide from "@/assets/g-01-wide.png.asset.json";
import art17 from "@/assets/art-17.png.asset.json";
import abstract from "@/assets/abstract.png.asset.json";
import sigil from "@/assets/sigil-001.png.asset.json";
import field from "@/assets/field.png.asset.json";
import art07 from "@/assets/art-07.png.asset.json";
import vieHaloVid from "@/assets/vie-halo.mp4.asset.json";
import gPortraitVid from "@/assets/g-01-portrait.mp4.asset.json";
import resonanceVid from "@/assets/resonance.mp4.asset.json";
import gVid from "@/assets/g-01.mp4.asset.json";

const orbitSectors = [
  "Real Estate",
  "Hospitality",
  "Luxury",
  "Media",
  "Architecture",
  "Culture",
  "Capital",
  "Technology",
] as const;

const journalEntries = [
  "The Architecture of Gravity",
  "Luxury as Infrastructure",
  "Why Most Brands Disappear",
  "Cultural Compounding",
  "Designing for the Next Century",
] as const;

const buildCards = [
  { title: "Culture", description: "Brands people belong to, not buy.", image: art17.url },
  { title: "Space", description: "Architecture as identity.", image: field.url },
  { title: "Media", description: "Narrative systems that compound influence.", image: art07.url },
  { title: "Ventures", description: "Businesses designed for decades.", image: abstract.url },
] as const;

const transformations = [
  ["A brand", "A category authority"],
  ["A property", "A destination"],
  ["A concept", "A cultural signal"],
  ["A business", "A legacy asset"],
] as const;

type BackdropLayer = {
  id: string;
  landscape: string;
  portrait: string;
  variant?: "default" | "light" | "strong";
  focal?: string;
};

const backdropLayers: BackdropLayer[] = [
  { id: "hero", landscape: spiralLandscape.url, portrait: spiralPortrait.url, variant: "light", focal: "center" },
  { id: "thesis", landscape: art17.url, portrait: haloPortrait.url, variant: "default", focal: "center 30%" },
  { id: "build", landscape: haloLandscape.url, portrait: haloPortrait.url, variant: "strong", focal: "center 70%" },
  { id: "ecosystem", landscape: field.url, portrait: spiralPortrait.url, variant: "strong", focal: "center" },
  { id: "standard", landscape: abstract.url, portrait: gravityPortrait.url, variant: "strong", focal: "center 40%" },
  { id: "transformations", landscape: gravityLandscape.url, portrait: gravityPortrait.url, variant: "default", focal: "center" },
  { id: "journal", landscape: futureLandscape.url, portrait: futurePortrait.url, variant: "strong", focal: "center 30%" },
  { id: "future", landscape: gWide.url, portrait: futurePortrait.url, variant: "light", focal: "center 24%" },
  { id: "invitation", landscape: art07.url, portrait: invitationPortrait.url, variant: "default", focal: "center" },
];

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0, 0.15, 0.35, 0.6, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|")]);
  return active;
}

function MorphingBackdrop({ activeId, layers }: { activeId: string; layers: BackdropLayer[] }) {
  const activeIndex = Math.max(0, layers.findIndex((l) => l.id === activeId));
  const eagerWindow = new Set<string>(
    [activeIndex, activeIndex + 1, activeIndex + 2]
      .filter((i) => i >= 0 && i < layers.length)
      .map((i) => layers[i]!.id),
  );
  const nextLayer = layers[activeIndex + 1];
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className="morphing-backdrop" aria-hidden="true">
      {nextLayer ? (
        <link
          rel="preload"
          as="image"
          href={isMobile ? nextLayer.portrait : nextLayer.landscape}
          // @ts-expect-error fetchpriority
          fetchpriority="low"
        />
      ) : null}
      {layers.map((layer, index) => {
        const isActive = layer.id === activeId;
        const isEager = eagerWindow.has(layer.id);
        const isFirst = index === 0;
        return (
          <div
            key={layer.id}
            className={`backdrop-layer backdrop-${layer.variant ?? "default"} ${isActive ? "is-active" : ""}`}
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={layer.portrait} />
              <source media="(min-width: 1024px)" srcSet={layer.landscape} />
              <img
                src={layer.portrait}
                alt=""
                loading={isEager ? "eager" : "lazy"}
                decoding="async"
                // @ts-expect-error fetchpriority
                fetchpriority={isFirst ? "high" : isActive ? "high" : "low"}
                className="backdrop-image"
                style={{ objectPosition: layer.focal ?? "center" }}
              />
            </picture>
            <div className="backdrop-overlay" />
          </div>
        );
      })}
      <div className="backdrop-vignette" />
    </div>
  );
}

export function SolenaPage() {
  const [activeSector, setActiveSector] = useState<string>(orbitSectors[0]);
  const heroRef = useRef<HTMLDivElement | null>(null);

  const sectorPositions = useMemo(
    () =>
      orbitSectors.map((label, index) => {
        const angle = (index / orbitSectors.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(angle) * 37;
        const y = 50 + Math.sin(angle) * 37;
        return { label, x, y };
      }),
    [],
  );

  const sections: SectionEntry[] = [
    { id: "hero", label: "Entrance" },
    { id: "thesis", label: "Thesis" },
    { id: "build", label: "What We Build" },
    { id: "ecosystem", label: "Ecosystem" },
    { id: "standard", label: "The Standard" },
    { id: "transformations", label: "Transformations" },
    { id: "journal", label: "The Journal" },
    { id: "future", label: "Solena 2035" },
    { id: "invitation", label: "Invitation" },
  ];

  const activeSection = useActiveSection(sections.map((s) => s.id));

  // Hero parallax — anime.js-driven pointer drift on the artifact
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 24;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 24;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      const artifact = root.querySelector<HTMLElement>(".artifact-shell");
      const word = root.querySelector<HTMLElement>(".hero-wordmark");
      if (artifact) artifact.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (word) word.style.transform = `translate3d(${cx * 0.4}px, ${cy * 0.4}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    root.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <main className="solena-page">
      <MorphingBackdrop activeId={activeSection} layers={backdropLayers} />
      <SectionNav sections={sections} />

      {/* ============== HERO ============== */}
      <section className="solena-hero" id="hero" ref={heroRef as never}>
        <div className="solena-noise" aria-hidden="true" />
        <div className="hero-video-frame" aria-hidden="true">
          <AmbientVideo src={vieHaloVid.url} className="hero-video" />
          <div className="hero-video-vignette" />
        </div>
        <div className="hero-inner">
          <div className="artifact-shell reveal-slow">
            <img src={sigil.url} alt="" className="artifact-mark" loading="eager" />
            <img src={solenaLogo.url} alt="Solena halo mark" className="artifact-mark artifact-mark--inner" loading="eager" />
          </div>
          <div className="hero-copy reveal-slower">
            <p className="eyebrow">Future institution</p>
            <img src={solenaWordmark.url} alt="SOLENA" className="hero-wordmark" loading="eager" />
            <h1 className="hero-title-desktop type-ogg">SOLENA</h1>
            <AnimatedLines as="p" className="hero-statement type-canela" stagger={70}>
              We build gravity for culture, capital, and legacy.
            </AnimatedLines>
            <AnimatedLines as="p" className="hero-subline" delay={500} stagger={50}>
              Luxury is not created. It is engineered.
            </AnimatedLines>
            <div className="hero-actions">
              <a href="#ecosystem" className="solena-button">
                <span>Enter the Ecosystem</span>
                <small>Cross the threshold</small>
              </a>
            </div>
            <p className="micro-copy">Access is selective.</p>
          </div>
        </div>
        <div className="hero-drift" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>

      {/* ============== THESIS — scrollytelling scene ============== */}
      <Scene id="thesis" className="solena-section thesis-section" height="auto">
        <div className="section-shell section-shell-wide">
          <div className="section-header">
            <p className="eyebrow" data-scene-layer="text">01 / Thesis</p>
            <h2 className="type-noe" data-scene-layer="text">The Solena Thesis</h2>
          </div>
          <div className="thesis-grid">
            <div className="thesis-body">
              {[
                "Most organizations compete for attention.",
                "Solena builds gravity.",
                "Gravity does not advertise. It attracts.",
                "It attracts capital that thinks long-term.",
                "It attracts founders who think in decades.",
                "It attracts institutions that outlive trends.",
                "We are not a service provider.",
                "We are an acceleration layer for legacy.",
              ].map((line) => (
                <p key={line} data-scene-layer="text" className="type-canela">{line}</p>
              ))}
            </div>
            <figure className="thesis-figure" data-scene-layer="image">
              <img src={gWide.url} alt="A constellation of light forming over a still field" />
              <figcaption>
                <SacredLine>What we build cannot be commoditized.</SacredLine>
              </figcaption>
            </figure>
          </div>
        </div>
      </Scene>

      {/* ============== BUILD — image-led cards ============== */}
      <Scene id="build" className="solena-section build-section" height="auto">
        <div className="section-shell">
          <div className="section-header">
            <p className="eyebrow" data-scene-layer="text">02 / What we build</p>
            <h2 className="type-noe" data-scene-layer="text">Systems with the patience of institutions.</h2>
          </div>
          <div className="build-grid">
            {buildCards.map((card, index) => (
              <article key={card.title} className="build-card image-card" data-scene-layer="image">
                <img src={card.image} alt="" className="build-card-bg" loading="lazy" />
                <div className="build-card-veil" />
                <span className="card-index">0{index + 1}</span>
                <h3 className="type-canela">{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Scene>

      {/* ============== ECOSYSTEM with ambient video ============== */}
      <section className="solena-section ecosystem-section" id="ecosystem">
        <div className="ecosystem-video-bed" aria-hidden="true">
          <AmbientVideo src={gVid.url} className="ecosystem-video" />
        </div>
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">03 / Ecosystem map</p>
            <h2 className="type-noe">Everything connects. Nothing operates alone.</h2>
          </div>
          <div className="ecosystem-layout">
            <div className="ecosystem-copy reveal-delayed">
              <p>
                Solena sits at the center of converging sectors, where brand, built environment,
                culture, capital, and narrative architecture begin to move as a single field.
              </p>
              <p className="micro-copy">Active sector: {activeSector}</p>
            </div>
            <div className="ecosystem-map reveal-slower" role="img" aria-label="Interactive Solena ecosystem map">
              <div className="ecosystem-rings" />
              <button
                type="button"
                className="center-node"
                onMouseEnter={() => setActiveSector("SOLENA")}
                onFocus={() => setActiveSector("SOLENA")}
              >
                <span className="type-canela">SOLENA</span>
              </button>
              {sectorPositions.map((sector) => (
                <button
                  key={sector.label}
                  type="button"
                  className={`orbit-node ${activeSector === sector.label ? "is-active" : ""}`}
                  style={{ left: `${sector.x}%`, top: `${sector.y}%` }}
                  onMouseEnter={() => setActiveSector(sector.label)}
                  onFocus={() => setActiveSector(sector.label)}
                >
                  <span>{sector.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== STANDARD — scrollytelling text reveal ============== */}
      <Scene id="standard" className="solena-section standard-section" height="auto">
        <div className="standard-bg" data-scene-layer="bg" aria-hidden="true">
          <img src={abstract.url} alt="" />
        </div>
        <div className="section-shell section-shell-narrow">
          <div className="standard-lines">
            {[
              "We do not optimize for speed.",
              "We optimize for permanence.",
              "We do not follow trends.",
              "We define signals.",
              "We do not build for markets.",
              "We build for memory.",
              "We do not design for visibility.",
              "We design for inevitability.",
            ].map((line, i) => (
              <AnimatedLines key={line} as="p" delay={i * 220} stagger={45} className="type-ogg">
                {line}
              </AnimatedLines>
            ))}
          </div>
          <p className="standard-final type-noe" data-scene-layer="text">
            <SacredLine>If it cannot exist for decades,</SacredLine> we do not build it.
          </p>
        </div>
      </Scene>

      {/* ============== TRANSFORMATIONS with portrait video ============== */}
      <Scene id="transformations" className="solena-section transitions-section" height="auto">
        <div className="section-shell section-shell-wide">
          <div className="section-header">
            <p className="eyebrow" data-scene-layer="text">04 / Transformations</p>
            <h2 className="type-noe" data-scene-layer="text">We do not execute projects. We shift states.</h2>
          </div>
          <div className="transitions-layout">
            <div className="transformation-list">
              {transformations.map(([from, to]) => (
                <div className="transformation-row" data-scene-layer="text" key={from}>
                  <span className="type-canela">{from}</span>
                  <i aria-hidden="true" />
                  <strong className="type-canela">{to}</strong>
                </div>
              ))}
              <p className="micro-copy" data-scene-layer="text">Each engagement alters trajectory, not surface.</p>
            </div>
            <figure className="transitions-figure" data-scene-layer="image">
              <AmbientVideo src={gPortraitVid.url} />
            </figure>
          </div>
        </div>
      </Scene>

      {/* ============== JOURNAL ============== */}
      <Scene id="journal" className="solena-section journal-section" height="auto">
        <div className="section-shell section-shell-wide">
          <div className="section-header">
            <p className="eyebrow" data-scene-layer="text">05 / The journal</p>
            <h2 className="type-noe" data-scene-layer="text">Ideas before they become industries.</h2>
          </div>
          <div className="journal-grid">
            {journalEntries.map((entry, index) => (
              <article className="journal-card" data-scene-layer="image" key={entry}>
                <span className="card-index">0{index + 1}</span>
                <h3 className="type-canela">{entry}</h3>
                <p>Read the pre-language</p>
              </article>
            ))}
          </div>
        </div>
      </Scene>

      {/* ============== FUTURE — pinned scene ============== */}
      <Scene id="future" className="solena-section future-section" height="180vh">
        <div className="future-stage" data-scene-layer="pin">
          <div className="future-stage-video" aria-hidden="true">
            <AmbientVideo src={resonanceVid.url} />
            <div className="future-stage-veil" />
          </div>
          <div className="section-shell section-shell-wide future-shell">
            <div className="section-header">
              <p className="eyebrow" data-scene-layer="text">06 / Future</p>
              <h2 className="type-ogg" data-scene-layer="text">Solena 2035</h2>
            </div>
            <div className="future-grid">
              <p data-scene-layer="text" className="type-canela">We are not building a company.</p>
              <p data-scene-layer="text" className="type-canela">We are building an ecosystem of institutions.</p>
              <ul>
                <li>Cultural institutions</li>
                <li>Luxury developments</li>
                <li>Media architecture</li>
                <li>Venture systems</li>
                <li>Design laboratories</li>
              </ul>
              <p className="future-final type-noe" data-scene-layer="text">
                <SacredLine>The present</SacredLine> is just the prototype.
              </p>
            </div>
          </div>
        </div>
      </Scene>

      {/* ============== INVITATION ============== */}
      <section className="solena-section invitation-section" id="invitation">
        <div className="invitation-bg" aria-hidden="true">
          <img src={art07.url} alt="" />
        </div>
        <div className="section-shell section-shell-narrow invitation-shell">
          <div className="section-header reveal">
            <p className="eyebrow">07 / Invitation</p>
            <h2 className="type-noe">Access is not open. It is aligned.</h2>
          </div>
          <div className="invitation-copy reveal-delayed">
            <p>We work with those building beyond cycles.</p>
            <p>Founders. Institutions. Architects. Investors. Cultural builders.</p>
          </div>
          <div className="hero-actions reveal-slower">
            <a href="mailto:access@solena.world?subject=Request%20Access" className="solena-button">
              <span>Request Access</span>
              <small>Signal alignment</small>
            </a>
          </div>
          <p className="micro-copy reveal-slower">Not everyone will be reviewed.</p>
          <p className="invitation-final type-noe reveal-slower">
            <SacredLine>If Solena is relevant to your trajectory,</SacredLine> you will know before we respond.
          </p>
        </div>
      </section>
    </main>
  );
}
