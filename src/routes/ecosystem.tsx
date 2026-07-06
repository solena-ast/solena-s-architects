import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { OrbitArcControls } from "@/components/orbit-arc-controls";
import { SECTORS, labelToSlug } from "@/lib/sectors";
import vieHalo from "@/assets/vie-halo.mp4.asset.json";
import vieHaloPoster from "@/assets/vie-halo-1.png.asset.json";
import one from "@/assets/001.png.asset.json";

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
  const navigate = useNavigate();
  const [activeSector, setActiveSector] = useState<string>(SECTORS[0].label);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hashMatch = window.location.hash.match(/sector=([\w-]+)/);
    const slug = params.get("sector") ?? hashMatch?.[1];
    const found = SECTORS.find((s) => s.slug === slug);
    if (found) setActiveSector(found.label);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = labelToSlug(activeSector);
    const url = new URL(window.location.href);
    if (url.searchParams.get("sector") === slug) return;
    url.searchParams.set("sector", slug);
    window.history.replaceState({}, "", url.toString());
  }, [activeSector]);

  const sectorPositions = useMemo(
    () =>
      SECTORS.map((s, index) => {
        const angle = (index / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + Math.cos(angle) * 37;
        const y = 50 + Math.sin(angle) * 37;
        return { label: s.label, slug: s.slug, x, y };
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
        <div className="ecosystem-fullbleed ecosystem-with-arc">
          <OrbitArcControls />
          <div className="ecosystem-map reveal-slower" role="img" aria-label="Interactive Solena ecosystem map">
            <div className="ecosystem-rings" />
            <button
              type="button"
              className="center-node"
              onMouseEnter={() => setActiveSector("SOLENA")}
              onFocus={() => setActiveSector("SOLENA")}
              onClick={() => navigate({ to: "/" })}
            >
              <span>SOLENA</span>
            </button>
            {sectorPositions.map((sector) => (
              <Link
                key={sector.label}
                to="/sector/$slug"
                params={{ slug: sector.slug }}
                className={`orbit-node ${activeSector === sector.label ? "is-active" : ""}`}
                style={{ left: `${sector.x}%`, top: `${sector.y}%` }}
                onMouseEnter={() => setActiveSector(sector.label)}
                onFocus={() => setActiveSector(sector.label)}
              >
                <span>{sector.label}</span>
              </Link>
            ))}
          </div>
          <div className="ecosystem-copy reveal-delayed">
            <p>
              Solena sits at the center of converging sectors — where brand, built environment,
              culture, capital, and narrative architecture move as a single field.
            </p>
            <p className="micro-copy">Active sector: {activeSector}</p>
            {activeSector !== "SOLENA" ? (
              <Link
                to="/sector/$slug"
                params={{ slug: labelToSlug(activeSector) }}
                className="micro-link"
              >
                Enter the {activeSector} chamber →
              </Link>
            ) : null}
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
