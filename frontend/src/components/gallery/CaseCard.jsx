import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import BeforeAfterSlider from "../ui/BeforeAfterSlider.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { floatCard } from "../../config/motion.js";

export default function CaseCard({ item, onOpen }) {
  const { t, format } = useI18n();
  const title = t("gallery.caseTitle", { grafts: format.number(item.grafts), service: item.serviceData?.shortTitle });

  return (
    <motion.article className="case-card" variants={floatCard} initial="rest" whileHover="hover" animate="rest" layout>
      <BeforeAfterSlider item={item} compact />
      <div className="case-card-body">
        <div className="case-card-meta">
          <span className="badge badge-soft">{t("gallery.monthsAfter", { n: item.months })}</span>
          <span className="case-card-origin">
            <Icon name="globe" size={14} /> {format.country(item.country)}
          </span>
        </div>
        <h3 className="case-card-title">{title}</h3>
        <p className="case-card-text">{item.highlight}</p>
        <button type="button" className="link-btn" onClick={() => onOpen(item)}>
          {t("common.viewDetails")} <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </motion.article>
  );
}
