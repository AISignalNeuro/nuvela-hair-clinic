import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";

// Animated single-open accordion. items: [{ id, q, a }]
export default function Accordion({ items, defaultOpen = 0, className = "" }) {
  const uid = useId();
  const [openId, setOpenId] = useState(items[defaultOpen]?.id ?? null);

  return (
    <div className={`accordion ${className}`}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${uid}-${item.id}`;
        return (
          <div key={item.id} className={`accordion-item ${isOpen ? "is-open" : ""}`}>
            <h3 className="accordion-heading">
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span>{item.q}</span>
                <span className="accordion-icon">
                  <Icon name={isOpen ? "minus" : "plus"} size={18} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className="accordion-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// schema.org FAQPage JSON-LD for a list of { q, a }.
// eslint-disable-next-line react-refresh/only-export-components
export const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
});
