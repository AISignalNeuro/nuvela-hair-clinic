// Merges language-neutral data (content/shared) with localized copy (locales/<lang>).
// English is bundled statically because it is also the fallback for missing keys;
// other languages are code-split and loaded on demand.
import en from "../locales/en/index.js";
import { SERVICES } from "./shared/services.js";
import { CASES, POSTS, DOCTORS, PACKAGES, TESTIMONIALS } from "./shared/catalog.js";

const loaders = {
  tr: () => import("../locales/tr/index.js"),
  ar: () => import("../locales/ar/index.js"),
};

const pick = (localized, fallback, key) => localized?.[key] ?? fallback?.[key] ?? {};

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// Deep-merge page copy so a partially translated locale still renders every section.
function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const out = { ...base };
  for (const [key, value] of Object.entries(override)) out[key] = deepMerge(base[key], value);
  return out;
}

export function buildContent(locale) {
  const services = SERVICES.map((s) => ({ ...s, ...pick(locale.services, en.services, s.slug) }));
  const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
  const doctors = DOCTORS.map((d) => ({ ...d, ...pick(locale.doctors, en.doctors, d.slug) }));
  const doctorBySlug = Object.fromEntries(doctors.map((d) => [d.slug, d]));

  return {
    services,
    serviceBySlug,
    cases: CASES.map((c) => ({ ...c, ...pick(locale.cases, en.cases, c.slug), serviceData: serviceBySlug[c.service] })),
    posts: POSTS.map((p) => ({ ...p, ...pick(locale.blog, en.blog, p.slug), authorData: doctorBySlug[p.author] })),
    doctors,
    doctorBySlug,
    packages: PACKAGES,
    testimonials: TESTIMONIALS.map((t) => ({ ...t, text: locale.testimonials?.[t.id] ?? en.testimonials[t.id] })),
    faqs: (locale.faqs?.length ? locale.faqs : en.faqs).map((f, i) => ({ ...f, id: `faq-${i + 1}` })),
    pages: locale === en ? en.pages : deepMerge(en.pages, locale.pages),
  };
}

const cache = new Map([["en", { ui: en.ui, content: buildContent(en) }]]);

export const getCachedBundle = (lang) => cache.get(lang);
export const fallbackUi = en.ui;

export async function loadBundle(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const mod = await loaders[lang]();
  const locale = mod.default;
  const bundle = { ui: locale.ui, content: buildContent(locale) };
  cache.set(lang, bundle);
  return bundle;
}
