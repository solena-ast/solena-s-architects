import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [telescope, setTelescope] = useState<{ x: number; y: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);

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

  // Deep-link: read ?sector= or #sector=, activate + trigger cinematic telescope pan.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hashMatch = window.location.hash.match(/sector=([\w-]+)/);
    const slug = params.get("sector") ?? hashMatch?.[1];
    if (!slug) return;
    const found = SECTORS.find((s) => s.slug === slug);
    if (!found) return;
    const pos = sectorPositions.find((p) => p.slug === slug);
    if (!pos) return;

    setActiveSector(found.label);
    // pan vector = center (50,50) minus node position, so node drifts toward center
    setTelescope({ x: 50 - pos.x, y: 50 - pos.y });

    // release the cinematic pan after the transition settles
    const t = window.setTimeout(() => setTelescope(null), 2600);
    return () => window.clearTimeout(t);
  }, [sectorPositions]);

  // Keep URL synced with active sector (without disturbing history).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = labelToSlug(activeSector);
    const url = new URL(window.location.href);
    if (url.searchParams.get("sector") === slug) return;
    url.searchParams.set("sector", slug);
    window.history.replaceState({}, "", url.toString());
  }, [activeSector]);

  const mapStyle = telescope
    ? ({
        "--tele-x": `${telescope.x * 0.55}%`,
        "--tele-y": `${telescope.y * 0.55}%`,
        "--tele-scale": "1.18",
      } as React.CSSProperties)
    : ({ "--tele-x": "0%", "--tele-y": "0%", "--tele-scale": "1" } as React.CSSProperties);

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
          <div
            ref={mapRef}
            className={`ecosystem-map reveal-slower ${telescope ? "is-telescoping" : ""}`}
            style={mapStyle}
            role="img"
            aria-label="Interactive Solena ecosystem map"
          >
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
