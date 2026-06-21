import { createFileRoute } from "@tanstack/react-router";

import { SolenaPage } from "@/components/solena-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SOLENA — Luxury Growth Studio" },
      {
        name: "description",
        content:
          "SOLENA is a luxury growth studio building gravity for culture, capital, legacy, and future institutions.",
      },
      { property: "og:title", content: "SOLENA — Luxury Growth Studio" },
      {
        property: "og:description",
        content:
          "A cinematic entrance into SOLENA, where brands, spaces, ventures, and cultural systems are engineered into legacy institutions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "SOLENA — Luxury Growth Studio" },
      {
        name: "twitter:description",
        content:
          "We build gravity for culture, capital, and legacy through cinematic strategy, design, and institutional thinking.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return <SolenaPage />;
}
