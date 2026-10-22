import Logo from "../ui/Logo.jsx";
import Icon from "../ui/Icon.jsx";
import LanguageSwitcher from "../ui/LanguageSwitcher.jsx";
import IstanbulSkyline from "../ui/IstanbulSkyline.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { SITE, STUDIO } from "../../content/shared/site.js";
import { whatsappLink } from "../../utils/contact.js";

export default function Footer() {
  const { t, content } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <IstanbulSkyline className="site-footer-skyline" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo size={40} className="logo--light" />
          <p>{t("footer.about")}</p>
          <div className="footer-socials">
            {Object.entries(SITE.socials).map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} className="social-btn">
                <Icon name={name} size={18} />
              </a>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="social-btn">
              <Icon name="whatsapp" size={18} />
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>{t("footer.treatments")}</h3>
          <ul>
            {content.services.map((s) => (
              <li key={s.slug}>
                <LocalizedLink to={`/services/${s.slug}`}>{s.shortTitle}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t("footer.clinic")}</h3>
          <ul>
            <li><LocalizedLink to="/about">{t("nav.about")}</LocalizedLink></li>
            <li><LocalizedLink to="/packages">{t("nav.packages")}</LocalizedLink></li>
            <li><LocalizedLink to="/gallery">{t("nav.results")}</LocalizedLink></li>
            <li><LocalizedLink to="/blog">{t("nav.blog")}</LocalizedLink></li>
          </ul>
          <h3 className="footer-col-sub">{t("footer.help")}</h3>
          <ul>
            <li><LocalizedLink to="/faq">{t("nav.faq")}</LocalizedLink></li>
            <li><LocalizedLink to="/booking">{t("nav.book")}</LocalizedLink></li>
            <li><LocalizedLink to="/privacy">{t("footer.privacy")}</LocalizedLink></li>
            <li><LocalizedLink to="/terms">{t("footer.terms")}</LocalizedLink></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h3>{t("footer.contact")}</h3>
          <ul>
            <li>
              <Icon name="phone" size={16} />
              <a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a>
            </li>
            <li>
              <Icon name="whatsapp" size={16} />
              <a href={whatsappLink()} target="_blank" rel="noreferrer" dir="ltr">{SITE.whatsappDisplay}</a>
            </li>
            <li>
              <Icon name="mail" size={16} />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <Icon name="mapPin" size={16} />
              <span>
                {SITE.address.street}, {SITE.address.postalCode} {SITE.address.district} / {SITE.address.city}
              </span>
            </li>
          </ul>
          <LanguageSwitcher variant="inline" />
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {year} {SITE.name}. {t("footer.rights")}</p>
        <p className="footer-disclaimer">
          <Icon name="info" size={14} /> {t("footer.demo")} {t("footer.medical")}
        </p>
      </div>

      <div className="footer-credit">
        <div className="container footer-credit-inner">
          <span className="footer-credit-label">{t("footer.builtBy")}</span>
          <a className="footer-credit-brand" href={STUDIO.url} target="_blank" rel="noopener">
            <span className="footer-credit-mark" aria-hidden="true">R</span>
            {STUDIO.name}
          </a>
          <a className="footer-credit-social" href={STUDIO.linkedin} target="_blank" rel="noopener" aria-label={`${STUDIO.name} LinkedIn`}>
            <Icon name="linkedin" size={16} />
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
