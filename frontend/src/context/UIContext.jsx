import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

// Global UI state: the quick-booking modal (with optional pre-selected service) and toasts.
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [booking, setBooking] = useState({ open: false, service: "" });
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const openBooking = useCallback((service = "") => setBooking({ open: true, service }), []);
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), []);

  const dismissToast = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const toast = useCallback(
    (message, type = "success") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => dismissToast(id), 3800);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ booking, openBooking, closeBooking, toasts, toast, dismissToast }),
    [booking, openBooking, closeBooking, toasts, toast, dismissToast],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
