import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { floatCard } from "../../config/motion.js";
import { formatPriceFrom } from "../../utils/format.js";

export default function ServiceCard({ service }) {
  const { t, format } = useI18n();
  const { openBooking } = useUI();

  return (
    <motion.article className="service-card" variants={floatCard} initial="rest" whileHover="hover" animate="rest" layout>
      <div className="service-card-top">
        <span className={`service-card-icon service-card-icon--${service.category}`}>
          <Icon name={service.icon} size={26} strokeWidth={1.6} />
        </span>
        {service.popular && <span className="badge badge-gold">{t("packages.mostPopular")}</span>}
      </div>
      <p className="service-card-category">{t(`categories.${service.category}`)}</p>
      <h3 className="service-card-title">
        <LocalizedLink to={`/services/${service.slug}`} className="stretched-link">
          {service.title}
        </LocalizedLink>
      </h3>
      <p className="service-card-text">{service.summary}</p>
      <div className="service-card-footer">
        <span className="service-card-price">{formatPriceFrom(service, t, format)}</span>
        <span className="service-card-actions">
          <button
            type="button"
            className="icon-btn icon-btn--soft"
            onClick={() => openBooking(service.slug)}
            aria-label={`${t("common.bookConsultation")}: ${service.shortTitle}`}
          >
            <Icon name="calendar" size={18} />
          </button>
          <span className="icon-btn icon-btn--primary" aria-hidden="true">
            <Icon name="arrowRight" size={18} />
          </span>
        </span>
      </div>
    </motion.article>
  );
}
