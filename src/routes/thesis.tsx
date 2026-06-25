import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import field from "@/assets/field.png.asset.json";

export const Route = createFileRoute("/thesis")({
  head: () => ({
    meta: [
      { title: "SOLENA — Thesis" },
      { name: "description", content: "Solena builds gravity. The thesis behind the institution." },
    ],
  }),
  component: ThesisPage,
});

function ThesisPage() {
  return (
    <PageShell
      eyebrow="01 / Thesis"
      title="The Solena Thesis"
      lede="Most organizations compete for attention. Solena builds gravity. Gravity does not advertise — it attracts."
      backdrop={{ kind: "image", landscape: field.url, portrait: field.url, focal: "center 35%" }}
      nextRoute={{ to: "/build", label: "What we build" }}
    >
      <section className="solena-section thesis-section">
        <div className="section-shell section-shell-wide">
          <div className="thesis-grid">
            <div className="thesis-body reveal-delayed">
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
      <section className="solena-section">
        <div className="section-shell section-shell-narrow">
          <Link to="/build" className="solena-button">
            <span>Move into the work</span>
            <small>Continue</small>
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
