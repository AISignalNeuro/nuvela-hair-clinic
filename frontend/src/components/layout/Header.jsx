import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../ui/Logo.jsx";
import Icon from "../ui/Icon.jsx";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import { LocalizedLink, LocalizedNavLink } from "../ui/LocalizedLink.jsx";
import MobileNav from "./MobileNav.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useScrolled } from "../../hooks/index.js";
import { SERVICE_CATEGORIES } from "../../content/shared/services.js";
import { formatPriceFrom } from "../../utils/format.js";
import { NAV_LINKS } from "../../config/navigation.js";

export default function Header() {
  const { t, lang, content, format } = useI18n();
  const { openBooking } = useUI();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const scrolled = useScrolled(20);
  // Menus remember the route they were opened on, so navigating closes them automatically.
  const [megaPath, setMegaPath] = useState(null);
  const [mobilePath, setMobilePath] = useState(null);
  const megaOpen = megaPath === location.pathname;
  const mobileOpen = mobilePath === location.pathname;
  const setMegaOpen = (open) => setMegaPath(open ? location.pathname : null);
  const setMobileOpen = (open) => setMobilePath(open ? location.pathname : null);
  const closeTimer = useRef(null);

  const isHome = location.pathname.replace(/\/$/, "") === `/${lang}`;
  const transparent = isHome && !scrolled && !megaOpen;

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  return (
    <>
      <a href="#main" className="skip-link">
        {t("nav.skip")}
      </a>
      <header className={`site-header ${transparent ? "site-header--transparent" : "site-header--solid"}`}>
        <div className="container header-bar">
          <LocalizedLink to="/" className="header-logo" aria-label="Nuvela Hair Clinic">
            <Logo size={38} />
          </LocalizedLink>

          <nav className="header-nav" aria-label="Main">
            <div className="header-nav-item" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
              <button
                type="button"
                className={`header-link header-link--menu ${location.pathname.includes("/services") ? "active" : ""}`}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => setMegaOpen(!megaOpen)}
                onFocus={openMega}
              >
                {t("nav.treatments")}
                <Icon name="chevronDown" size={14} className={megaOpen ? "rotate-180" : ""} />
              </button>
            </div>
            {NAV_LINKS.map((link) => (
              <LocalizedNavLink key={link.to} to={link.to} className="header-link">
                {t(`nav.${link.key}`)}
              </LocalizedNavLink>
            ))}
          </nav>

          <div className="header-actions">
            <LanguageSwitcher />
            <LocalizedLink
              to={isAuthenticated ? "/profile" : "/auth"}
              className="icon-btn header-account"
              aria-label={isAuthenticated ? t("nav.account") : t("nav.signIn")}
            >
              <Icon name="user" size={20} />
            </LocalizedLink>
            <button type="button" className="btn btn-primary btn-sm header-cta" onClick={() => openBooking()}>
              <Icon name="sparkle" size={16} />
              {t("nav.book")}
            </button>
            <button type="button" className="icon-btn header-burger" onClick={() => setMobileOpen(true)} aria-label={t("nav.menu")}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && (
            <motion.div
              className="mega-menu"
              onMouseEnter={openMega}
              onMouseLeave={scheduleClose}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="container mega-menu-inner">
                <div className="mega-menu-groups">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <div key={cat} className="mega-group">
                      <p className="mega-group-title">{t(`categories.${cat}`)}</p>
                      <ul>
                        {content.services
                          .filter((s) => s.category === cat)
                          .map((s) => (
                            <li key={s.slug}>
                              <LocalizedLink to={`/services/${s.slug}`} className="mega-link">
                                <span className="mega-link-icon">
                                  <Icon name={s.icon} size={20} />
                                </span>
                                <span>
                                  <strong>{s.shortTitle}</strong>
                                  <small>{formatPriceFrom(s, t, format)}</small>
                                </span>
                              </LocalizedLink>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mega-feature">
                  <span className="mega-feature-icon">
                    <Icon name="camera" size={26} />
                  </span>
                  <p className="mega-feature-title">{t("megaMenu.featuredTitle")}</p>
                  <p className="mega-feature-text">{t("megaMenu.featuredText")}</p>
                  <button type="button" className="btn btn-gold btn-sm" onClick={() => openBooking()}>
                    {t("megaMenu.featuredCta")}
                    <Icon name="arrowRight" size={16} />
                  </button>
                  <LocalizedLink to="/services" className="mega-all">
                    {t("nav.allTreatments")} <Icon name="arrowRight" size={14} />
                  </LocalizedLink>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
