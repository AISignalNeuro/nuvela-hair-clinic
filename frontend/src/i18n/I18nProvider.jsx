import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getLanguage, rememberLanguage } from "./config.js";
import { fallbackUi, getCachedBundle, loadBundle } from "../content/index.js";

const I18nContext = createContext(null);

const lookup = (obj, path) => path.split(".").reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);

const interpolate = (value, vars) =>
  typeof value === "string" && vars
    ? value.replace(/\{(\w+)\}/g, (match, name) => (vars[name] ?? match).toString())
    : value;

export function I18nProvider({ lang, children }) {
  // Already-loaded languages render synchronously; others show a loader until their chunk arrives.
  const [loaded, setLoaded] = useState(null);
  const cached = getCachedBundle(lang);
  const bundle = cached ?? (loaded?.lang === lang ? loaded.bundle : null);

  useEffect(() => {
    if (getCachedBundle(lang)) return undefined;
    let alive = true;
    loadBundle(lang).then((next) => alive && setLoaded({ lang, bundle: next }));
    return () => {
      alive = false;
    };
  }, [lang]);

  const language = getLanguage(lang);

  useEffect(() => {
    document.documentElement.lang = language.code;
    document.documentElement.dir = language.dir;
    rememberLanguage(language.code);
  }, [language]);

  const t = useCallback(
    (key, vars) => {
      const value = lookup(bundle?.ui, key) ?? lookup(fallbackUi, key);
      if (value === undefined) {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key "${key}"`);
        return key;
      }
      return interpolate(value, vars);
    },
    [bundle],
  );

  const formatters = useMemo(() => {
    const locale = language.intl;
    return {
      price: (amount, currency = "EUR") =>
        new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount),
      number: (n) => new Intl.NumberFormat(locale).format(n),
      date: (iso, opts = { day: "numeric", month: "long", year: "numeric" }) =>
        new Intl.DateTimeFormat(locale, opts).format(new Date(iso)),
      country: (code) => {
        try {
          return new Intl.DisplayNames([locale], { type: "region" }).of(code);
        } catch {
          return code;
        }
      },
      language: (code) => {
        try {
          return new Intl.DisplayNames([locale], { type: "language" }).of(code);
        } catch {
          return code;
        }
      },
    };
  }, [language]);

  const value = useMemo(
    () => ({
      lang: language.code,
      dir: language.dir,
      language,
      t,
      content: bundle?.content,
      format: formatters,
      // Prefix an app path with the active language: "/services" → "/tr/services".
      localePath: (path = "/") => `/${language.code}${path === "/" ? "" : path}`,
    }),
    [language, t, bundle, formatters],
  );

  if (!bundle) return <div className="page-loader" aria-busy="true" />;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
