// Language-neutral service data. Localized copy lives in src/locales/<lang>/services.js
// and is merged by slug (see src/content/index.js).
//
// category: hair | women | facial | treatment
// art: which procedural illustration to use (scalp | female | beard | brow)
// facts: values are language-neutral; labels/units are translated in the UI strings.

export const SERVICE_CATEGORIES = ["hair", "women", "facial", "treatment"];

export const SERVICES = [
  {
    slug: "sapphire-fue",
    category: "hair",
    icon: "gem",
    art: "scalp",
    featured: true,
    popular: true,
    priceFrom: 2350,
    facts: [
      { key: "duration", value: "6–8", unit: "hours" },
      { key: "grafts", value: "2,500–4,500", unit: "grafts" },
      { key: "anesthesia", value: "local", unit: null },
      { key: "recovery", value: "7–10", unit: "days" },
      { key: "results", value: "9–12", unit: "months" },
      { key: "stay", value: "3", unit: "nights" },
    ],
  },
  {
    slug: "dhi-hair-transplant",
    category: "hair",
    icon: "pen",
    art: "scalp",
    featured: true,
    priceFrom: 2850,
    facts: [
      { key: "duration", value: "7–9", unit: "hours" },
      { key: "grafts", value: "2,000–3,500", unit: "grafts" },
      { key: "anesthesia", value: "local", unit: null },
      { key: "recovery", value: "5–7", unit: "days" },
      { key: "results", value: "9–12", unit: "months" },
      { key: "stay", value: "3", unit: "nights" },
    ],
  },
  {
    slug: "womens-hair-transplant",
    category: "women",
    icon: "female",
    art: "female",
    featured: true,
    priceFrom: 2650,
    facts: [
      { key: "duration", value: "6–8", unit: "hours" },
      { key: "grafts", value: "1,500–3,000", unit: "grafts" },
      { key: "anesthesia", value: "local", unit: null },
      { key: "recovery", value: "5–7", unit: "days" },
      { key: "results", value: "10–12", unit: "months" },
      { key: "stay", value: "3", unit: "nights" },
    ],
  },
  {
    slug: "beard-transplant",
    category: "facial",
    icon: "beard",
    art: "beard",
    featured: true,
    priceFrom: 1950,
    facts: [
      { key: "duration", value: "4–6", unit: "hours" },
      { key: "grafts", value: "1,500–3,000", unit: "grafts" },
      { key: "anesthesia", value: "local", unit: null },
      { key: "recovery", value: "5–7", unit: "days" },
      { key: "results", value: "6–12", unit: "months" },
      { key: "stay", value: "2", unit: "nights" },
    ],
  },
  {
    slug: "eyebrow-transplant",
    category: "facial",
    icon: "brow",
    art: "brow",
    featured: true,
    priceFrom: 1650,
    facts: [
      { key: "duration", value: "3–4", unit: "hours" },
      { key: "grafts", value: "300–700", unit: "grafts" },
      { key: "anesthesia", value: "local", unit: null },
      { key: "recovery", value: "5–7", unit: "days" },
      { key: "results", value: "6–10", unit: "months" },
      { key: "stay", value: "2", unit: "nights" },
    ],
  },
  {
    slug: "prp-therapy",
    category: "treatment",
    icon: "drop",
    art: "scalp",
    featured: true,
    priceFrom: 150,
    priceUnit: "session",
    facts: [
      { key: "duration", value: "45–60", unit: "minutes" },
      { key: "sessions", value: "3–4", unit: "sessions" },
      { key: "anesthesia", value: "topical", unit: null },
      { key: "recovery", value: "0", unit: "days" },
      { key: "results", value: "3–6", unit: "months" },
    ],
  },
  {
    slug: "hair-mesotherapy",
    category: "treatment",
    icon: "sparkle",
    art: "female",
    featured: false,
    priceFrom: 120,
    priceUnit: "session",
    facts: [
      { key: "duration", value: "30–45", unit: "minutes" },
      { key: "sessions", value: "4–6", unit: "sessions" },
      { key: "anesthesia", value: "topical", unit: null },
      { key: "recovery", value: "0", unit: "days" },
      { key: "results", value: "2–4", unit: "months" },
    ],
  },
];
