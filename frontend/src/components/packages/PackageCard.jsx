import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";

export default function PackageCard({ pkg, compact = false }) {
  const { t, format, content } = useI18n();
  const { openBooking } = useUI();
  const name = t(`packages.names.${pkg.slug}`);
  const technique = content.serviceBySlug[pkg.technique];
  const features = compact ? pkg.includes.slice(3, 10) : pkg.includes;

  return (
    <motion.article
      className={`package-card ${pkg.popular ? "package-card--popular" : ""}`}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {pkg.popular && <span className="package-ribbon">{t("packages.mostPopular")}</span>}
      <h3 className="package-name">{name}</h3>
      <p className="package-tagline">{t(`packages.taglines.${pkg.slug}`)}</p>
      <p className="package-price">
        <span className="package-price-from">{t("common.from")}</span>
        <span className="package-price-value">{format.price(pkg.priceFrom)}</span>
        <span className="package-price-note">{t("packages.perPerson")}</span>
      </p>
      <p className="package-technique">
        <Icon name={technique?.icon ?? "gem"} size={16} /> {t("packages.technique")}: <strong>{technique?.shortTitle}</strong>
      </p>
      <ul className="check-list">
        {features.map((key) => (
          <li key={key}>
            <Icon name="check" size={16} /> {t(`packages.features.${key}`)}
          </li>
        ))}
      </ul>
      <button type="button" className={`btn w-100 ${pkg.popular ? "btn-gold" : "btn-primary"}`} onClick={() => openBooking(pkg.technique)}>
        {t("packages.choose", { name })}
      </button>
    </motion.article>
  );
}
