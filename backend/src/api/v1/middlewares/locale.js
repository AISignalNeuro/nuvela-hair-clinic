import { DEFAULT_LOCALE, LOCALES } from "../../../utils/i18n.js";

// Resolves req.locale from ?lang=, then Accept-Language, then the default.
export function resolveLocale(req, res, next) {
  const fromQuery = String(req.query.lang || "").slice(0, 2).toLowerCase();
  const fromHeader = req.acceptsLanguages(...LOCALES);
  req.locale = LOCALES.includes(fromQuery) ? fromQuery : fromHeader || DEFAULT_LOCALE;
  res.setHeader("Content-Language", req.locale);
  next();
}
