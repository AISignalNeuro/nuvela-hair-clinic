import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { isDemoMode } from "../../config/app.js";
import { whatsappLink } from "../../utils/contact.js";

export default function BookingSuccess({ reference, onDone, doneLabel }) {
  const { t } = useI18n();
  return (
    <motion.div className="booking-success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
      <motion.span
        className="booking-success-icon"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
      >
        <Icon name="check" size={36} strokeWidth={2.4} />
      </motion.span>
      <h3>{t("booking.successTitle")}</h3>
      <p>{t("booking.successText")}</p>
      {reference && (
        <p className="booking-ref">
          {t("booking.successRef")}: <strong dir="ltr">{reference}</strong>
        </p>
      )}
      <div className="booking-success-actions">
        <a className="btn btn-whatsapp" href={whatsappLink(t("booking.whatsappMessage", { ref: reference }))} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={18} /> {t("booking.continueWhatsapp")}
        </a>
        {onDone && (
          <button type="button" className="btn btn-ghost" onClick={onDone}>
            {doneLabel ?? t("common.close")}
          </button>
        )}
      </div>
      {isDemoMode && <p className="demo-note"><Icon name="info" size={14} /> {t("booking.demoMode")}</p>}
    </motion.div>
  );
}
