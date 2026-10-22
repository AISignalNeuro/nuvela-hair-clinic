import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import { useUI } from "../../context/UIContext.jsx";

export default function Toasts() {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            layout
          >
            <Icon name={toast.type === "error" ? "info" : "check"} size={18} />
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
              <Icon name="close" size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
