import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import art17 from "@/assets/art-1.7.png.asset.json";

const journalEntries = [
  { title: "The Architecture of Gravity", date: "Vol. 01" },
  { title: "Luxury as Infrastructure", date: "Vol. 02" },
  { title: "Why Most Brands Disappear", date: "Vol. 03" },
  { title: "Cultural Compounding", date: "Vol. 04" },
  { title: "Designing for the Next Century", date: "Vol. 05" },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "SOLENA — Journal" },
      { name: "description", content: "Ideas before they become industries." },
    ],
  }),
  component: JournalPage,
});

function JournalPage() {
  return (
    <PageShell
      eyebrow="05 / Journal"
      title="Ideas before they become industries."
      lede="Long-form notation on permanence, taste, and the architecture of cultural systems."
      backdrop={{ kind: "image", landscape: art17.url, portrait: art17.url, focal: "center 30%" }}
      nextRoute={{ to: "/future", label: "Solena 2035" }}
    >
      <section className="solena-section journal-section">
        <div className="section-shell section-shell-wide">
          <div className="journal-grid">
            {journalEntries.map((entry, index) => (
              <article className="journal-card reveal" key={entry.title} style={{ animationDelay: `${index * 90}ms` }}>
                <span className="card-index">{entry.date}</span>
                <h3>{entry.title}</h3>
                <p>Read the pre-language</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
