import { AnimatePresence, motion } from "framer-motion";
import Logo from "../ui/Logo.jsx";
import Icon from "../ui/Icon.jsx";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import { LocalizedNavLink } from "../ui/LocalizedLink.jsx";
import { NAV_LINKS } from "../../config/navigation.js";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useEscape, useLockBodyScroll } from "../../hooks/index.js";
import { SITE } from "../../content/shared/site.js";
import { whatsappLink } from "../../utils/contact.js";

export default function MobileNav({ open, onClose }) {
  const { t, dir } = useI18n();
  const { openBooking } = useUI();
  useLockBodyScroll(open);
  useEscape(open, onClose);
  const offscreen = dir === "rtl" ? "-100%" : "100%";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="drawer-root" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="drawer-backdrop" onClick={onClose} />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="drawer-head">
              <Logo size={34} />
              <button type="button" className="icon-btn" onClick={onClose} aria-label={t("nav.close")}>
                <Icon name="close" size={22} />
              </button>
            </div>
            <nav className="drawer-nav" aria-label="Mobile">
              <LocalizedNavLink to="/services" onClick={onClose}>
                <Icon name="follicle" size={20} /> {t("nav.treatments")}
              </LocalizedNavLink>
              {NAV_LINKS.map((link) => (
                <LocalizedNavLink key={link.to} to={link.to} onClick={onClose}>
                  <Icon name={link.icon} size={20} /> {t(`nav.${link.key}`)}
                </LocalizedNavLink>
              ))}
              <LocalizedNavLink to="/auth" onClick={onClose}>
                <Icon name="user" size={20} /> {t("nav.account")}
              </LocalizedNavLink>
            </nav>
            <div className="drawer-lang">
              <p className="drawer-label">{t("nav.language")}</p>
              <LanguageSwitcher variant="inline" onChange={onClose} />
            </div>
            <div className="drawer-actions">
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => {
                  onClose();
                  openBooking();
                }}
              >
                {t("nav.book")}
              </button>
              <a className="btn btn-whatsapp w-100" href={whatsappLink()} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> {t("common.whatsapp")}
              </a>
              <a className="drawer-phone" href={SITE.phoneHref}>
                <Icon name="phone" size={16} /> <span dir="ltr">{SITE.phone}</span>
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
