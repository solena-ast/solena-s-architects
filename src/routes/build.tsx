import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import abstract from "@/assets/abstract.png.asset.json";

const buildCards = [
  { title: "Culture", description: "Brands people belong to, not buy." },
  { title: "Space", description: "Architecture as identity." },
  { title: "Media", description: "Narrative systems that compound influence." },
  { title: "Ventures", description: "Businesses designed for decades." },
] as const;

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "SOLENA — What We Build" },
      { name: "description", content: "Systems with the patience of institutions." },
    ],
  }),
  component: BuildPage,
});

function BuildPage() {
  return (
    <PageShell
      eyebrow="02 / Practice"
      title="Systems with the patience of institutions."
      lede="Four disciplines. One field. We work where brand, space, media, and venture converge."
      backdrop={{ kind: "image", landscape: abstract.url, portrait: abstract.url, focal: "center" }}
      nextRoute={{ to: "/ecosystem", label: "See the ecosystem" }}
    >
      <section className="solena-section build-section">
        <div className="section-shell">
          <div className="build-grid">
            {buildCards.map((card, index) => (
              <article key={card.title} className="build-card reveal" style={{ animationDelay: `${index * 120}ms` }}>
                <span className="card-index">0{index + 1}</span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
