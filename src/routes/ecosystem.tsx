import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";
import vieHalo from "@/assets/vie-halo.mp4.asset.json";
import vieHaloPoster from "@/assets/vie-halo-1.png.asset.json";
import one from "@/assets/001.png.asset.json";

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

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "SOLENA — Ecosystem" },
      { name: "description", content: "Everything connects. Nothing operates alone." },
    ],
  }),
  component: EcosystemPage,
});

function EcosystemPage() {
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
    <PageShell
      eyebrow="03 / Ecosystem map"
      title="Everything connects. Nothing operates alone."
      backdrop={{ kind: "video", landscape: vieHalo.url, poster: vieHaloPoster.url }}
      nextRoute={{ to: "/standard", label: "Read the standard" }}
    >
      <section className="solena-section ecosystem-section ecosystem-section--full">
        <div className="ecosystem-fullbleed">
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
          <div className="ecosystem-copy reveal-delayed">
            <p>
              Solena sits at the center of converging sectors — where brand, built environment,
              culture, capital, and narrative architecture move as a single field.
            </p>
            <p className="micro-copy">Active sector: {activeSector}</p>
          </div>
        </div>
      </section>
      <section className="solena-section">
        <div className="section-shell section-shell-narrow">
          <img src={one.url} alt="" className="inline-art" loading="lazy" />
        </div>
      </section>
    </PageShell>
  );
}
