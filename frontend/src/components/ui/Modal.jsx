import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";
import { backdrop, modalPanel } from "../../config/motion.js";
import { useEscape, useLockBodyScroll } from "../../hooks/index.js";
import { useI18n } from "../../i18n/I18nProvider.jsx";

// Accessible glass modal: focus moves in on open, Escape/backdrop closes, scroll is locked.
export default function Modal({ open, onClose, title, size = "md", children, className = "", labelledBy }) {
  const { t } = useI18n();
  const panelRef = useRef(null);
  useLockBodyScroll(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const id = requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      previous?.focus?.();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="modal-root" variants={backdrop} initial="hidden" animate="visible" exit="exit">
          <div className="modal-backdrop" onClick={onClose} />
          <motion.div
            ref={panelRef}
            className={`modal-panel modal-panel--${size} ${className}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : title}
            tabIndex={-1}
            variants={modalPanel}
          >
            <button type="button" className="modal-close" onClick={onClose} aria-label={t("common.close")}>
              <Icon name="close" size={20} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
