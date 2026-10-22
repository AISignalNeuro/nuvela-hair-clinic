// Runs after `vite build`:
//  1. copies index.html → 404.html so GitHub Pages serves the SPA for deep links,
//  2. writes sitemap.xml (every page × every language, with hreflang alternates),
//  3. writes robots.txt.
import { copyFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SERVICES } from "../src/content/shared/services.js";
import { POSTS } from "../src/content/shared/catalog.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const siteUrl = (process.env.VITE_SITE_URL || "https://aisignalneuro.github.io/nuvela-hair-clinic").replace(/\/+$/, "");
const languages = ["en", "tr", "ar"];

copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));

const staticPaths = ["/", "/services", "/packages", "/gallery", "/blog", "/about", "/faq", "/contact", "/booking", "/privacy", "/terms"];
const paths = [...staticPaths, ...SERVICES.map((s) => `/services/${s.slug}`), ...POSTS.map((p) => `/blog/${p.slug}`)];
const today = new Date().toISOString().slice(0, 10);
const url = (lang, path) => `${siteUrl}/${lang}${path === "/" ? "/" : path}`;

const entries = paths.flatMap((path) =>
  languages.map((lang) => {
    const alternates = languages
      .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${url(alt, path)}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url("en", path)}"/>`)
      .join("\n");
    const priority = path === "/" ? "1.0" : path.split("/").length > 2 ? "0.7" : "0.8";
    return `  <url>\n    <loc>${url(lang, path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n${alternates}\n  </url>`;
  }),
);

writeFileSync(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`,
);
writeFileSync(resolve(dist, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /*/auth\nDisallow: /*/profile\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

console.log(`postbuild: 404.html, sitemap.xml (${entries.length} urls) and robots.txt written for ${siteUrl}`);
