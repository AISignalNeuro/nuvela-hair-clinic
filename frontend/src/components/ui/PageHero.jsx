import { motion } from "framer-motion";
import Breadcrumbs from "./Breadcrumbs.jsx";
import { EASE } from "../../config/motion.js";

// Compact dark hero used at the top of inner pages.
export default function PageHero({ eyebrow, title, subtitle, crumbs, children, aside }) {
  return (
    <section className="page-hero">
      <div className="hero-aurora hero-aurora--soft" aria-hidden="true">
        <span className="aurora aurora--1" />
        <span className="aurora aurora--2" />
      </div>
      <div className="hero-pattern" aria-hidden="true" />
      <div className={`container page-hero-inner ${aside ? "page-hero-inner--split" : ""}`}>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}>
          {crumbs && <Breadcrumbs items={crumbs} light />}
          {eyebrow && <span className="eyebrow eyebrow--light">{eyebrow}</span>}
          <h1 className="page-hero-title">{title}</h1>
          {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
          {children}
        </motion.div>
        {aside && (
          <motion.div
            className="page-hero-aside"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.1, ease: EASE } }}
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}
