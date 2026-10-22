import Seo from "../../components/ui/Seo.jsx";
import Icon from "../../components/ui/Icon.jsx";
import ScalpArt from "../../components/ui/ScalpArt.jsx";
import LocalizedLink from "../../components/ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { NAV_LINKS } from "../../config/navigation.js";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <Seo title="404" noindex />
      <section className="not-found">
        <div className="container not-found-inner">
          <div className="not-found-art">
            <ScalpArt variant="scalp" stage="before" severity={5} seed={404} />
            <span className="not-found-code">404</span>
          </div>
          <div>
            <h1>{t("notFound.title")}</h1>
            <p className="lead">{t("notFound.text")}</p>
            <div className="hero-actions">
              <LocalizedLink to="/" className="btn btn-primary">
                <Icon name="arrowLeft" size={16} /> {t("common.backHome")}
              </LocalizedLink>
              <LocalizedLink to="/services" className="btn btn-ghost">
                {t("nav.treatments")}
              </LocalizedLink>
            </div>
            <ul className="not-found-links">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <LocalizedLink to={link.to}>
                    <Icon name={link.icon} size={16} /> {t(`nav.${link.key}`)}
                  </LocalizedLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
