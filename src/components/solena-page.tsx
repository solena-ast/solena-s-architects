import { useMemo, useState } from "react";

import { SectionNav, AnimatedLines, type SectionEntry } from "@/components/section-nav";
import solenaLogo from "@/assets/solena-logo-removebg-preview.png.asset.json";
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
  {
    title: "Culture",
    description: "Brands people belong to, not buy.",
  },
  {
    title: "Space",
    description: "Architecture as identity.",
  },
  {
    title: "Media",
    description: "Narrative systems that compound influence.",
  },
  {
    title: "Ventures",
    description: "Businesses designed for decades.",
  },
] as const;

const transformations = [
  ["A brand", "A category authority"],
  ["A property", "A destination"],
  ["A concept", "A cultural signal"],
  ["A business", "A legacy asset"],
] as const;

function ResponsiveBackdrop({
  landscape,
  portrait,
  alt,
  className = "",
  overlayClassName = "",
  fit = "cover",
}: {
  landscape: string;
  portrait?: string;
  alt: string;
  className?: string;
  overlayClassName?: string;
  fit?: "cover" | "contain";
}) {
  const objectClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <div className={`environment-plane ${className}`.trim()} aria-hidden="true">
      <picture>
        {portrait ? <source media="(max-width: 768px)" srcSet={portrait} /> : null}
        <source media="(min-width: 1024px)" srcSet={landscape} />
        <img src={portrait ?? landscape} alt={alt} className={`environment-image ${objectClass}`} />
      </picture>
      <div className={`environment-overlay ${overlayClassName}`.trim()} />
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

  return (
    <main className="solena-page">
      <section className="solena-hero">
        <ResponsiveBackdrop
          landscape={spiralLandscape.url}
          portrait={spiralPortrait.url}
          alt="Luminous circular Solena atmosphere"
          className="environment-hero"
          fit="cover"
        />
        <div className="solena-noise" aria-hidden="true" />
        <div className="hero-inner">
          <div className="artifact-shell reveal-slow">
            <img src={solenaLogo.url} alt="Solena circular halo mark" className="artifact-mark" loading="eager" />
          </div>
          <div className="hero-copy reveal-slower">
            <p className="eyebrow">Future institution</p>
            <h1>SOLENA</h1>
            <p className="hero-statement">We build gravity for culture, capital, and legacy.</p>
            <p className="hero-subline">Luxury is not created. It is engineered.</p>
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

      <section className="solena-section thesis-section">
        <ResponsiveBackdrop
          landscape={haloLandscape.url}
          portrait={haloPortrait.url}
          alt="Dust field forming a circular halo"
          className="environment-thesis"
          fit="cover"
        />
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

      <section className="solena-section build-section">
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

      <section className="solena-section standard-section">
        <div className="section-shell section-shell-narrow">
          <div className="standard-lines reveal">
            <p>We do not optimize for speed.</p>
            <p>We optimize for permanence.</p>
            <p>We do not follow trends.</p>
            <p>We define signals.</p>
            <p>We do not build for markets.</p>
            <p>We build for memory.</p>
            <p>We do not design for visibility.</p>
            <p>We design for inevitability.</p>
          </div>
          <p className="standard-final reveal-slower">
            If it cannot exist for decades, we do not build it.
          </p>
        </div>
      </section>

      <section className="solena-section transitions-section">
        <ResponsiveBackdrop
          landscape={gravityLandscape.url}
          portrait={gravityPortrait.url}
          alt="Luminous matter gathering in space"
          className="environment-transformation"
          overlayClassName="environment-overlay-strong"
          fit="cover"
        />
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

      <section className="solena-section journal-section">
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

      <section className="solena-section future-section">
        <ResponsiveBackdrop
          landscape={futureLandscape.url}
          portrait={futurePortrait.url}
          alt="Monumental field of future resonance"
          className="environment-future"
          overlayClassName="environment-overlay-light"
          fit="cover"
        />
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

      <section className="solena-section invitation-section">
        <ResponsiveBackdrop
          landscape={gravityLandscape.url}
          portrait={invitationPortrait.url}
          alt="Quiet invitation field of luminous matter"
          className="environment-invitation"
          overlayClassName="environment-overlay-strong"
          fit="cover"
        />
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
