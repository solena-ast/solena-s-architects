import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import gLandscape from "@/assets/g-01.mp4.asset.json";
import gPortrait from "@/assets/g-01-potrait.mp4.asset.json";
import gPoster from "@/assets/g-01.png.asset.json";

export const Route = createFileRoute("/future")({
  head: () => ({
    meta: [
      { title: "SOLENA — 2035" },
      { name: "description", content: "We are not building a company. We are building an ecosystem of institutions." },
    ],
  }),
  component: FuturePage,
});

function FuturePage() {
  return (
    <PageShell
      eyebrow="06 / Future"
      title="Solena 2035"
      lede="The present is just the prototype."
      backdrop={{ kind: "video", landscape: gLandscape.url, portrait: gPortrait.url, poster: gPoster.url }}
      nextRoute={{ to: "/invitation", label: "Request access" }}
    >
      <section className="solena-section future-section">
        <div className="section-shell section-shell-wide future-shell">
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
    </PageShell>
  );
}
