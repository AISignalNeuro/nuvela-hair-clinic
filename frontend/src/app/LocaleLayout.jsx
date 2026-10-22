import { Suspense, useEffect } from "react";
import { Navigate, useLocation, useOutlet, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { I18nProvider } from "../i18n/I18nProvider.jsx";
import { detectLanguage, isSupportedLang } from "../i18n/config.js";
import Header from "../components/layout/Header.jsx";
import Footer from "../components/layout/Footer.jsx";
import FloatingContact from "../components/layout/FloatingContact.jsx";
import Toasts from "../components/layout/Toasts.jsx";
import BookingModal from "../components/booking/BookingModal.jsx";
import { pageTransition } from "../config/motion.js";

// Wraps every "/:lang/*" route: validates the language, provides i18n and renders the site chrome.
export default function LocaleLayout() {
  const { lang } = useParams();
  const location = useLocation();

  if (!isSupportedLang(lang)) {
    // "/services" (no language) → "/en/services" using the visitor's preferred language.
    return <Navigate to={`/${detectLanguage()}${location.pathname}${location.search}${location.hash}`} replace />;
  }

  return (
    <I18nProvider lang={lang}>
      <Header />
      <main id="main" className="site-main">
        <AnimatedOutlet />
      </main>
      <Footer />
      <FloatingContact />
      <BookingModal />
      <Toasts />
    </I18nProvider>
  );
}

function AnimatedOutlet() {
  const location = useLocation();
  const outlet = useOutlet();

  // Scroll to top on navigation, or to the #hash target when present.
  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" }));
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} variants={pageTransition} initial="initial" animate="animate" exit="exit">
        <Suspense fallback={<div className="page-loader" aria-busy="true" />}>{outlet}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
