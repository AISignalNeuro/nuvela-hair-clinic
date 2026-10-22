import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useScrolled } from "../../hooks/index.js";
import { SITE } from "../../content/shared/site.js";
import { whatsappLink } from "../../utils/contact.js";

// Floating glass action dock: WhatsApp (pulsing) + expandable call/booking + back-to-top.
export default function FloatingContact() {
  const { t } = useI18n();
  const { openBooking } = useUI();
  const [open, setOpen] = useState(false);
  const showTop = useScrolled(700);

  const actions = [
    { key: "call", icon: "phone", href: SITE.phoneHref, label: t("floating.call"), className: "fab-mini--phone" },
    { key: "book", icon: "calendar", onClick: () => openBooking(), label: t("floating.book"), className: "fab-mini--book" },
  ];

  return (
    <div className="fab-dock">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="fab-mini fab-mini--top"
            aria-label={t("floating.top")}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
          >
            <Icon name="arrowUp" size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open &&
          actions.map((action, i) => {
            const Tag = action.href ? motion.a : motion.button;
            return (
              <Tag
                key={action.key}
                className={`fab-mini ${action.className}`}
                href={action.href}
                type={action.href ? undefined : "button"}
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                aria-label={action.label}
                initial={{ opacity: 0, y: 16, scale: 0.7 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: 0.04 * (actions.length - i) } }}
                exit={{ opacity: 0, y: 12, scale: 0.7 }}
              >
                <Icon name={action.icon} size={18} />
                <span className="fab-label">{action.label}</span>
              </Tag>
            );
          })}
      </AnimatePresence>

      <div className="fab-main-row">
        <motion.button
          type="button"
          className={`fab-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-label={t("floating.open")}
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.92 }}
        >
          <Icon name={open ? "close" : "plus"} size={20} />
        </motion.button>
        <motion.a
          className="fab-whatsapp"
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label={t("floating.whatsapp")}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          animate={{ y: [0, -5, 0] }}
          transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <span className="fab-ring" />
          <span className="fab-ring fab-ring--delay" />
          <Icon name="whatsapp" size={28} />
          <span className="fab-label fab-label--whatsapp">{t("floating.whatsapp")}</span>
        </motion.a>
      </div>
    </div>
  );
}
