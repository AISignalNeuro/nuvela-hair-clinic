import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";
import { LANGUAGES } from "../../i18n/config.js";
import { useI18n } from "../../i18n/I18nProvider.jsx";

// Swaps the language prefix of the current URL and keeps query string and hash.
export default function LanguageSwitcher({ variant = "dropdown", onChange }) {
  const { lang, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const switchTo = (code) => {
    const rest = location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
    navigate(`/${code}${rest}${location.search}${location.hash}`);
    setOpen(false);
    onChange?.(code);
  };

  if (variant === "inline") {
    return (
      <div className="lang-inline" role="group" aria-label={t("languages.label")}>
        {LANGUAGES.map((l) => (
          <button key={l.code} type="button" lang={l.code} className={l.code === lang ? "is-active" : ""} onClick={() => switchTo(l.code)}>
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  const current = LANGUAGES.find((l) => l.code === lang);
  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("languages.label")}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" size={18} />
        <span>{current.short}</span>
        <Icon name="chevronDown" size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="lang-switcher-menu"
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            {LANGUAGES.map((l) => (
              <li key={l.code} role="option" aria-selected={l.code === lang}>
                <button type="button" lang={l.code} onClick={() => switchTo(l.code)}>
                  <span className="lang-code">{l.short}</span>
                  <span>{l.label}</span>
                  {l.code === lang && <Icon name="check" size={16} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
