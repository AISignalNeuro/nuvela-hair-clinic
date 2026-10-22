// Supported languages. Adding a language = add an entry here + a folder in src/locales.
export const LANGUAGES = [
  { code: "en", label: "English", short: "EN", dir: "ltr", intl: "en-GB", ogLocale: "en_US" },
  { code: "tr", label: "Türkçe", short: "TR", dir: "ltr", intl: "tr-TR", ogLocale: "tr_TR" },
  { code: "ar", label: "العربية", short: "AR", dir: "rtl", intl: "ar", ogLocale: "ar_AR" },
];

export const DEFAULT_LANG = "en";
export const LANG_CODES = LANGUAGES.map((l) => l.code);
export const STORAGE_KEY = "nuvela.lang";

export const getLanguage = (code) => LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
export const isSupportedLang = (code) => LANG_CODES.includes(code);

// Saved choice → browser language → default.
export function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLang(saved)) return saved;
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  const browser = (navigator.languages ?? [navigator.language ?? ""])
    .map((l) => l.slice(0, 2).toLowerCase())
    .find(isSupportedLang);
  return browser ?? DEFAULT_LANG;
}

export function rememberLanguage(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // Non-critical convenience only.
  }
}
