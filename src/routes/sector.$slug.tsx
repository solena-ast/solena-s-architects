import { createFileRoute, notFound, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { SECTORS, getSector } from "@/lib/sectors";
import haloLandscape from "@/assets/vie-halo-1.png.asset.json";
import haloPortrait from "@/assets/vie-potrait.png.asset.json";
import spiralLandscape from "@/assets/spiral.png.asset.json";
import spiralPortrait from "@/assets/spiral-potrait.png.asset.json";
import gravityLandscape from "@/assets/gravity-1.1.png.asset.json";
import gravityPortrait from "@/assets/gravity-1.1-potrait.png.asset.json";
import futureLandscape from "@/assets/Gemini_Generated_Image_ttgdtyttgdtyttgd.png.asset.json";
import futurePortrait from "@/assets/resonance-2-potrait.png.asset.json";

const backdropBySlug: Record<string, { landscape: string; portrait: string }> = {
  "real-estate": { landscape: gravityLandscape.url, portrait: gravityPortrait.url },
  hospitality: { landscape: haloLandscape.url, portrait: haloPortrait.url },
  luxury: { landscape: futureLandscape.url, portrait: futurePortrait.url },
  media: { landscape: spiralLandscape.url, portrait: spiralPortrait.url },
  architecture: { landscape: gravityLandscape.url, portrait: gravityPortrait.url },
  culture: { landscape: haloLandscape.url, portrait: haloPortrait.url },
  capital: { landscape: futureLandscape.url, portrait: futurePortrait.url },
  technology: { landscape: spiralLandscape.url, portrait: spiralPortrait.url },
};

export const Route = createFileRoute("/sector/$slug")({
  loader: ({ params }) => {
    const sector = getSector(params.slug);
    if (!sector) throw notFound();
    return { sector };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "SOLENA — Sector" }, { name: "robots", content: "noindex" }] };
    }
    const { sector } = loaderData;
    return {
      meta: [
        { title: `SOLENA — ${sector.label}` },
        { name: "description", content: sector.lede },
        { property: "og:title", content: `SOLENA — ${sector.label}` },
        { property: "og:description", content: sector.lede },
      ],
    };
  },
  notFoundComponent: () => (
    <PageShell
      eyebrow="Sector"
      title="This sector is not open."
      backdrop={{ kind: "image", landscape: spiralLandscape.url, portrait: spiralPortrait.url }}
    >
      <section className="solena-section">
        <div className="section-shell section-shell-narrow">
          <p>The chamber you tried to enter does not exist.</p>
          <Link to="/ecosystem" className="solena-button" style={{ marginTop: "2rem" }}>
            <span>Return to the ecosystem</span>
            <small>Re-enter the field</small>
          </Link>
        </div>
      </section>
    </PageShell>
  ),
  component: SectorPage,
});

function SectorPage() {
  const { sector } = Route.useLoaderData();
  const backdrop = backdropBySlug[sector.slug] ?? backdropBySlug.hospitality;
  const currentIdx = SECTORS.findIndex((s) => s.slug === sector.slug);
  const next = SECTORS[(currentIdx + 1) % SECTORS.length];

  return (
    <PageShell
      eyebrow={sector.eyebrow}
      title={sector.headline}
      lede={sector.lede}
      backdrop={{ kind: "image", landscape: backdrop.landscape, portrait: backdrop.portrait }}
      nextRoute={{ to: "/sector/$slug", label: `Next — ${next.label}` } as unknown as { to: string; label: string }}
    >
      <section className="solena-section">
        <div className="section-shell section-shell-wide">
          <div className="sector-principles">
            {sector.principles.map((p: string, i: number) => (
              <article key={p} className="sector-principle reveal" style={{ animationDelay: `${i * 140}ms` }}>
                <span className="card-index">0{i + 1}</span>
                <p>{p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="solena-section">
        <div className="section-shell section-shell-wide">
          <div className="section-header reveal">
            <p className="eyebrow">Transformations</p>
            <h2>What we shift.</h2>
          </div>
          <div className="transformation-list">
            {sector.transformations.map(([from, to]: [string, string], i: number) => (
              <div className="transformation-row reveal" style={{ animationDelay: `${i * 120}ms` }} key={from}>
                <span>{from}</span>
                <i aria-hidden="true" />
                <strong>{to}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="solena-section">
        <div className="section-shell section-shell-narrow">
          <p className="standard-final reveal-slower">{sector.closing}</p>
        </div>
      </section>

      <section className="solena-section">
        <div className="section-shell section-shell-wide">
          <p className="eyebrow">Sibling chambers</p>
          <nav className="sector-siblings">
            {SECTORS.filter((s) => s.slug !== sector.slug).map((s) => (
              <Link key={s.slug} to="/sector/$slug" params={{ slug: s.slug }}>
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </PageShell>
  );
}
