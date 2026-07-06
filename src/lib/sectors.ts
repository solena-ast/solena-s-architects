export type Sector = {
  slug: string;
  label: string;
  eyebrow: string;
  headline: string;
  lede: string;
  principles: [string, string, string];
  transformations: Array<[string, string]>;
  closing: string;
};

export const SECTORS: readonly Sector[] = [
  {
    slug: "real-estate",
    label: "Real Estate",
    eyebrow: "Sector · Real Estate",
    headline: "Land becomes narrative before it becomes value.",
    lede:
      "We shape developments as instruments of memory. The site is never the product — the perception is.",
    principles: [
      "Position first. Build second.",
      "Every asset is a signal in a longer sentence.",
      "Distribution is architecture, not marketing.",
    ],
    transformations: [
      ["A parcel", "A destination"],
      ["A tower", "A cultural address"],
      ["A masterplan", "An institutional district"],
    ],
    closing: "Where others sell square footage, we compose gravity.",
  },
  {
    slug: "hospitality",
    label: "Hospitality",
    eyebrow: "Sector · Hospitality",
    headline: "Service is choreography. Experience is doctrine.",
    lede:
      "We engineer hospitality identities that behave like institutions — reverent, repeatable, and quietly inevitable.",
    principles: [
      "Ritual outperforms novelty.",
      "The room is the last surface, not the first.",
      "Guests remember tempo, not features.",
    ],
    transformations: [
      ["A hotel", "A rite"],
      ["A restaurant", "A cultural fixture"],
      ["A resort", "A place of return"],
    ],
    closing: "We design the reason to arrive — and the reason to return.",
  },
  {
    slug: "luxury",
    label: "Luxury",
    eyebrow: "Sector · Luxury",
    headline: "Luxury is not decoration. It is discipline.",
    lede:
      "We build houses that behave like institutions: restrained, referential, and difficult to imitate.",
    principles: [
      "Restraint is the loudest statement.",
      "Provenance is engineered, not claimed.",
      "Access is designed the day the brand is drawn.",
    ],
    transformations: [
      ["A product", "A hierarchy"],
      ["A collection", "A canon"],
      ["A house", "A standard"],
    ],
    closing: "Luxury we build is inherited, not consumed.",
  },
  {
    slug: "media",
    label: "Media",
    eyebrow: "Sector · Media",
    headline: "Narrative infrastructure that compounds.",
    lede:
      "We architect media systems that behave like private central banks of attention — measured, patient, sovereign.",
    principles: [
      "Signal before scale.",
      "One document can outperform a decade of posts.",
      "Cadence is more valuable than reach.",
    ],
    transformations: [
      ["A newsletter", "A publication of record"],
      ["A voice", "A jurisdiction"],
      ["A feed", "A library"],
    ],
    closing: "We build media that becomes cited, not consumed.",
  },
  {
    slug: "architecture",
    label: "Architecture",
    eyebrow: "Sector · Architecture",
    headline: "Buildings that intend to outlast their brief.",
    lete: "",
    lede:
      "We treat architecture as the physical residue of ideology. Programme is temporary. Proportion is not.",
    principles: [
      "Mass communicates before language does.",
      "Materials are a form of ethics.",
      "Every threshold is a decision about hierarchy.",
    ],
    transformations: [
      ["A structure", "A monument"],
      ["A brief", "A doctrine"],
      ["A footprint", "A field"],
    ],
    closing: "What we design should still make sense in a century.",
  } as unknown as Sector,
  {
    slug: "culture",
    label: "Culture",
    eyebrow: "Sector · Culture",
    headline: "Culture is engineered before it feels inevitable.",
    lede:
      "We author the institutions — biennales, prizes, salons, publications — that decide what becomes canon.",
    principles: [
      "Taste is a system, not an opinion.",
      "The audience is architecture, not a metric.",
      "Reference is more powerful than reach.",
    ],
    transformations: [
      ["An event", "A season"],
      ["A community", "A movement"],
      ["A moment", "A cycle"],
    ],
    closing: "We build culture that other people study.",
  },
  {
    slug: "capital",
    label: "Capital",
    eyebrow: "Sector · Capital",
    headline: "Capital that behaves like architecture.",
    lede:
      "We shape the perception layer that lets patient capital move at institutional weight — clearly, quietly, deliberately.",
    principles: [
      "Trust is designed, not announced.",
      "Narrative is a form of underwriting.",
      "The strongest LP deck is a worldview.",
    ],
    transformations: [
      ["A fund", "A thesis"],
      ["A portfolio", "A philosophy"],
      ["A GP", "An institution"],
    ],
    closing: "Capital gathers where meaning is already dense.",
  },
  {
    slug: "technology",
    label: "Technology",
    eyebrow: "Sector · Technology",
    headline: "Technology as a slow, sovereign material.",
    lede:
      "We treat technology the way great houses once treated glass or stone — as a raw material for permanence, not novelty.",
    principles: [
      "Interfaces are ideology in disguise.",
      "The pace of a product teaches the user.",
      "Restraint is a competitive advantage.",
    ],
    transformations: [
      ["A tool", "A protocol"],
      ["A product", "A standard"],
      ["A platform", "A field"],
    ],
    closing: "We build technology that ages with intention.",
  },
];

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}

export function labelToSlug(label: string): string {
  return SECTORS.find((s) => s.label === label)?.slug ?? label.toLowerCase().replace(/\s+/g, "-");
}
