import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import { AnimatedLines } from "@/components/section-nav";
import art07 from "@/assets/art-07.png.asset.json";

const standardLines = [
  "We do not optimize for speed.",
  "We optimize for permanence.",
  "We do not follow trends.",
  "We define signals.",
  "We do not build for markets.",
  "We build for memory.",
  "We do not design for visibility.",
  "We design for inevitability.",
];

export const Route = createFileRoute("/standard")({
  head: () => ({
    meta: [
      { title: "SOLENA — The Standard" },
      { name: "description", content: "If it cannot exist for decades, we do not build it." },
    ],
  }),
  component: StandardPage,
});

function StandardPage() {
  return (
    <PageShell
      eyebrow="04 / Standard"
      title="The standard is permanence."
      backdrop={{ kind: "image", landscape: art07.url, portrait: art07.url, focal: "center 40%" }}
      nextRoute={{ to: "/journal", label: "Open the journal" }}
    >
      <section className="solena-section standard-section">
        <div className="section-shell section-shell-narrow">
          <div className="standard-lines">
            {standardLines.map((line, i) => (
              <AnimatedLines key={line} as="p" delay={i * 220} stagger={45}>
                {line}
              </AnimatedLines>
            ))}
          </div>
          <p className="standard-final reveal-slower">If it cannot exist for decades, we do not build it.</p>
        </div>
      </section>
    </PageShell>
  );
}
