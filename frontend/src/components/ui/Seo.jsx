import { useI18n } from "../../i18n/I18nProvider.jsx";
import { LANGUAGES } from "../../i18n/config.js";
import { APP } from "../../config/app.js";
import { SITE } from "../../content/shared/site.js";

// React 19 hoists <title>, <meta> and <link> into <head>, so pages can declare SEO inline.
// `path` is the route without the language prefix, e.g. "/services/sapphire-fue".
export default function Seo({ title, description, path = "/", type = "website", jsonLd, noindex = false }) {
  const { lang, language, t } = useI18n();
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${t("meta.defaultTitle")}`;
  const desc = description || t("meta.defaultDescription");
  const suffix = path === "/" ? "/" : path;
  const url = (code) => `${APP.siteUrl}/${code}${suffix}`;
  const image = `${APP.siteUrl}/og-image.png`;
  const schemas = [jsonLd].flat().filter(Boolean);

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url(lang)} />
      {LANGUAGES.map((l) => (
        <link key={l.code} rel="alternate" hrefLang={l.code} href={url(l.code)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={url("en")} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url(lang)} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={language.ogLocale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape "<" so JSON content can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
