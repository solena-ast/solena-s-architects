import { useEffect, useMemo, useState } from "react";

import { SectionNav, AnimatedLines, type SectionEntry } from "@/components/section-nav";
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
  { title: "Culture", description: "Brands people belong to, not buy." },
  { title: "Space", description: "Architecture as identity." },
  { title: "Media", description: "Narrative systems that compound influence." },
  { title: "Ventures", description: "Businesses designed for decades." },
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
  focal?: string; // object-position
};

const backdropLayers: BackdropLayer[] = [
  { id: "hero", landscape: spiralLandscape.url, portrait: spiralPortrait.url, variant: "light", focal: "center" },
  { id: "thesis", landscape: haloLandscape.url, portrait: haloPortrait.url, variant: "default", focal: "center 30%" },
  { id: "build", landscape: haloLandscape.url, portrait: haloPortrait.url, variant: "strong", focal: "center 70%" },
  { id: "ecosystem", landscape: spiralLandscape.url, portrait: spiralPortrait.url, variant: "strong", focal: "center" },
  { id: "standard", landscape: gravityLandscape.url, portrait: gravityPortrait.url, variant: "strong", focal: "center 40%" },
  { id: "transformations", landscape: gravityLandscape.url, portrait: gravityPortrait.url, variant: "default", focal: "center" },
  { id: "journal", landscape: futureLandscape.url, portrait: futurePortrait.url, variant: "strong", focal: "center 30%" },
  { id: "future", landscape: futureLandscape.url, portrait: futurePortrait.url, variant: "light", focal: "center 24%" },
  { id: "invitation", landscape: gravityLandscape.url, portrait: invitationPortrait.url, variant: "default", focal: "center" },
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
        // Pick the entry closest to viewport center
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
  // Eagerly load the active layer + the next two so cross-fades are instant on scroll.
  const eagerWindow = new Set<string>(
    [activeIndex, activeIndex + 1, activeIndex + 2]
      .filter((i) => i >= 0 && i < layers.length)
      .map((i) => layers[i]!.id),
  );
  // The very next layer is also preloaded via <link rel="preload"> for the
  // browser preload scanner — picks the right source per viewport.
  const nextLayer = layers[activeIndex + 1];
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  return (
    <div className="morphing-backdrop" aria-hidden="true">
      {nextLayer ? (
        <link
          rel="preload"
          as="image"
          href={isMobile ? nextLayer.portrait : nextLayer.landscape}
          // @ts-expect-error: React types miss imagesrcset/fetchpriority
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
                // @ts-expect-error: React types miss fetchpriority
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

  return (
    <main className="solena-page">
      <MorphingBackdrop activeId={activeSection} layers={backdropLayers} />
      <SectionNav sections={sections} />

      <section className="solena-hero" id="hero">
        <div className="solena-noise" aria-hidden="true" />
        <div className="hero-inner">
          <div className="artifact-shell reveal-slow">
            <img src={solenaLogo.url} alt="Solena circular halo mark" className="artifact-mark" loading="eager" />
          </div>
          <div className="hero-copy reveal-slower">
            <p className="eyebrow">Future institution</p>
            <img
              src={solenaWordmark.url}
              alt="SOLENA"
              className="hero-wordmark"
              loading="eager"
            />
            <h1 className="hero-title-desktop">SOLENA</h1>
            <AnimatedLines as="p" className="hero-statement" stagger={70}>
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

      <section className="solena-section thesis-section" id="thesis">
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">01 / Thesis</p>
            <h2>The Solena Thesis</h2>
          </div>
          <div className="thesis-grid">
            <div className="thesis-body reveal-delayed">
              <p>Most organizations compete for attention.</p>
              <p>Solena builds gravity.</p>
              <p>Gravity does not advertise. It attracts.</p>
              <p>It attracts capital that thinks long-term.</p>
              <p>It attracts founders who think in decades.</p>
              <p>It attracts institutions that outlive trends.</p>
              <p>We are not a service provider.</p>
              <p>We are an acceleration layer for legacy.</p>
            </div>
            <p className="micro-copy reveal-slower">What we build cannot be commoditized.</p>
          </div>
        </div>
      </section>

      <section className="solena-section build-section" id="build">
        <div className="section-shell">
          <div className="section-header reveal">
            <p className="eyebrow">02 / What we build</p>
            <h2>Systems with the patience of institutions.</h2>
          </div>
          <div className="build-grid">
            {buildCards.map((card, index) => (
              <article
                key={card.title}
                className="build-card reveal"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <span className="card-index">0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solena-section ecosystem-section" id="ecosystem">
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">03 / Ecosystem map</p>
            <h2>Everything connects. Nothing operates alone.</h2>
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
                <span>SOLENA</span>
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

      <section className="solena-section standard-section" id="standard">
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
              <AnimatedLines key={line} as="p" delay={i * 220} stagger={45}>
                {line}
              </AnimatedLines>
            ))}
          </div>
          <p className="standard-final reveal-slower">
            If it cannot exist for decades, we do not build it.
          </p>
        </div>
      </section>

      <section className="solena-section transitions-section" id="transformations">
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">04 / Transformations</p>
            <h2>We do not execute projects. We shift states.</h2>
          </div>
          <div className="transformation-list">
            {transformations.map(([from, to], index) => (
              <div className="transformation-row reveal" style={{ animationDelay: `${index * 120}ms` }} key={from}>
                <span>{from}</span>
                <i aria-hidden="true" />
                <strong>{to}</strong>
              </div>
            ))}
          </div>
          <p className="micro-copy reveal-delayed">Each engagement alters trajectory, not surface.</p>
        </div>
      </section>

      <section className="solena-section journal-section" id="journal">
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">05 / The journal</p>
            <h2>Ideas before they become industries.</h2>
          </div>
          <div className="journal-grid">
            {journalEntries.map((entry, index) => (
              <article className="journal-card reveal" key={entry} style={{ animationDelay: `${index * 90}ms` }}>
                <span className="card-index">0{index + 1}</span>
                <h3>{entry}</h3>
                <p>Read the pre-language</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solena-section future-section" id="future">
        <div className="section-shell section-shell-wide future-shell">
          <div className="section-header reveal">
            <p className="eyebrow">06 / Future</p>
            <h2>Solena 2035</h2>
          </div>
          <div className="future-grid reveal-delayed">
            <p>We are not building a company.</p>
            <p>We are building an ecosystem of institutions.</p>
            <ul>
              <li>Cultural institutions</li>
              <li>Luxury developments</li>
              <li>Media architecture</li>
              <li>Venture systems</li>
              <li>Design laboratories</li>
            </ul>
            <p className="future-final">The present is just the prototype.</p>
          </div>
        </div>
      </section>

      <section className="solena-section invitation-section" id="invitation">
        <div className="section-shell section-shell-narrow invitation-shell">
          <div className="section-header reveal">
            <p className="eyebrow">07 / Invitation</p>
            <h2>Access is not open. It is aligned.</h2>
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
          <p className="invitation-final reveal-slower">
            If Solena is relevant to your trajectory, you will know before we respond.
          </p>
        </div>
      </section>
    </main>
  );
}
