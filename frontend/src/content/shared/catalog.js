// Language-neutral data for gallery cases, blog posts, doctors and packages.
// Localized copy is merged by slug from src/locales/<lang>/*.

// --- Before/after cases -----------------------------------------------------
// Visuals are SVG illustrations drawn in code (see ScalpArt), never real
// patient photos. `severity` (1–5) drives how sparse the "before" state is and
// `seed` keeps every drawing stable between renders.
export const CASES = [
  { slug: "sapphire-fue-3800-norwood-4", service: "sapphire-fue", art: "scalp", grafts: 3800, age: 34, gender: "male", country: "GB", months: 12, severity: 4, seed: 11, featured: true },
  { slug: "dhi-2600-hairline", service: "dhi-hair-transplant", art: "scalp", grafts: 2600, age: 29, gender: "male", country: "DE", months: 10, severity: 2, seed: 27, featured: true },
  { slug: "beard-2200-full-design", service: "beard-transplant", art: "beard", grafts: 2200, age: 31, gender: "male", country: "SA", months: 9, severity: 4, seed: 5, featured: true },
  { slug: "eyebrow-550-reconstruction", service: "eyebrow-transplant", art: "brow", grafts: 550, age: 38, gender: "female", country: "NL", months: 8, severity: 4, seed: 19, featured: false },
  { slug: "womens-2100-part-line", service: "womens-hair-transplant", art: "female", grafts: 2100, age: 42, gender: "female", country: "FR", months: 12, severity: 3, seed: 33, featured: true },
  { slug: "sapphire-fue-4500-crown", service: "sapphire-fue", art: "scalp", grafts: 4500, age: 45, gender: "male", country: "US", months: 14, severity: 5, seed: 41, featured: false },
  { slug: "dhi-3000-unshaven", service: "dhi-hair-transplant", art: "scalp", grafts: 3000, age: 36, gender: "male", country: "AE", months: 11, severity: 3, seed: 8, featured: false },
  { slug: "beard-1600-cheek-line", service: "beard-transplant", art: "beard", grafts: 1600, age: 27, gender: "male", country: "IE", months: 8, severity: 3, seed: 14, featured: false },
  { slug: "eyebrow-380-density", service: "eyebrow-transplant", art: "brow", grafts: 380, age: 30, gender: "female", country: "TR", months: 7, severity: 3, seed: 52, featured: false },
];

// --- Blog -------------------------------------------------------------------
export const BLOG_CATEGORIES = ["costs", "techniques", "aftercare", "travel", "guides"];

export const POSTS = [
  { slug: "hair-transplant-cost-turkey", category: "costs", publishedAt: "2026-09-18", readTime: 7, theme: "gold", icon: "tag", author: "ayse-korkmaz", featured: true },
  { slug: "sapphire-fue-vs-dhi", category: "techniques", publishedAt: "2026-09-02", readTime: 6, theme: "turquoise", icon: "gem", author: "kerem-yalcin", featured: true },
  { slug: "aftercare-first-14-days", category: "aftercare", publishedAt: "2026-08-21", readTime: 6, theme: "teal", icon: "drop", author: "selin-aras", featured: false },
  { slug: "istanbul-trip-planner", category: "travel", publishedAt: "2026-08-05", readTime: 5, theme: "navy", icon: "plane", author: "ayse-korkmaz", featured: false },
  { slug: "choose-safe-clinic-turkey", category: "guides", publishedAt: "2026-07-22", readTime: 7, theme: "rose", icon: "shield", author: "selin-aras", featured: false },
  { slug: "hair-growth-timeline", category: "aftercare", publishedAt: "2026-07-08", readTime: 5, theme: "sage", icon: "calendar", author: "leyla-demir", featured: false },
];

// --- Team -------------------------------------------------------------------
// Fictional team members for the demo. Avatars are monograms, not photos.
export const DOCTORS = [
  { slug: "selin-aras", name: "Dr. Selin Aras", initials: "SA", years: 14, languages: ["tr", "en", "de"], hue: 182 },
  { slug: "kerem-yalcin", name: "Dr. Kerem Yalçın", initials: "KY", years: 11, languages: ["tr", "en"], hue: 205 },
  { slug: "leyla-demir", name: "Dr. Leyla Demir", initials: "LD", years: 9, languages: ["tr", "en", "ar"], hue: 34 },
  { slug: "ayse-korkmaz", name: "Ayşe Korkmaz", initials: "AK", years: 8, languages: ["tr", "en", "ar", "de"], hue: 330 },
];

// --- Packages ---------------------------------------------------------------
// `includes` are feature keys translated in the UI strings (packages.features.*).
export const PACKAGES = [
  {
    slug: "essential",
    priceFrom: 2350,
    technique: "sapphire-fue",
    popular: false,
    includes: ["consultation", "procedure", "medication", "hotel4", "nights2", "transfer", "interpreter", "firstWash", "aftercareKit", "prp1", "followUp6"],
  },
  {
    slug: "comfort",
    priceFrom: 2850,
    technique: "sapphire-fue",
    popular: true,
    includes: ["consultation", "procedure", "medication", "hotel5", "nights3", "vipTransfer", "interpreter", "firstWash", "aftercareKit", "prp2", "followUp12", "certificate"],
  },
  {
    slug: "premium",
    priceFrom: 3650,
    technique: "dhi-hair-transplant",
    popular: false,
    includes: ["consultation", "procedure", "medication", "hotelBosphorus", "nights4", "chauffeur", "interpreter", "firstWash", "aftercareKit", "prp3", "followUp24", "certificate", "companion", "cityTour"],
  },
];

// Package comparison table rows. Rows with several features show the matching
// feature label per package; `label` is a key under packages.rows.* in the UI strings.
export const PACKAGE_FEATURE_ROWS = [
  { features: ["consultation"] },
  { features: ["procedure"] },
  { features: ["medication"] },
  { label: "hotel", features: ["hotel4", "hotel5", "hotelBosphorus"] },
  { label: "nights", features: ["nights2", "nights3", "nights4"] },
  { label: "transfer", features: ["transfer", "vipTransfer", "chauffeur"] },
  { features: ["interpreter"] },
  { features: ["firstWash"] },
  { features: ["aftercareKit"] },
  { label: "prp", features: ["prp1", "prp2", "prp3"] },
  { label: "followUp", features: ["followUp6", "followUp12", "followUp24"] },
  { features: ["certificate"] },
  { features: ["companion"] },
  { features: ["cityTour"] },
];

// --- Testimonials -----------------------------------------------------------
export const TESTIMONIALS = [
  { id: "t1", name: "James W.", country: "GB", rating: 5, service: "sapphire-fue" },
  { id: "t2", name: "Markus H.", country: "DE", rating: 5, service: "dhi-hair-transplant" },
  { id: "t3", name: "Omar A.", country: "SA", rating: 5, service: "beard-transplant" },
  { id: "t4", name: "Sophie V.", country: "NL", rating: 5, service: "womens-hair-transplant" },
  { id: "t5", name: "Daniel K.", country: "IE", rating: 4, service: "sapphire-fue" },
  { id: "t6", name: "Lina M.", country: "AE", rating: 5, service: "eyebrow-transplant" },
];

// --- FAQ --------------------------------------------------------------------
export const FAQ_CATEGORIES = ["general", "procedure", "travel", "aftercare", "pricing"];
