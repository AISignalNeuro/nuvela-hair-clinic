import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import IstanbulSkyline from "../ui/IstanbulSkyline.jsx";
import BeforeAfterSlider from "../ui/BeforeAfterSlider.jsx";
import { Stars } from "../ui/Primitives.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { SITE } from "../../content/shared/site.js";
import { whatsappLink } from "../../utils/contact.js";
import { EASE } from "../../config/motion.js";

const rise = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: EASE } },
});

export default function HomeHero() {
  const { t, content, format } = useI18n();
  const { openBooking } = useUI();
  const copy = content.pages.home.hero;
  const heroCase = content.cases[0];

  return (
    <section className="hero">
      <div className="hero-aurora" aria-hidden="true">
        <span className="aurora aurora--1" />
        <span className="aurora aurora--2" />
        <span className="aurora aurora--3" />
      </div>
      <div className="hero-pattern" aria-hidden="true" />

      <div className="container hero-grid">
        <div className="hero-content">
          <motion.span className="hero-badge" {...rise(0.05)}>
            <span className="hero-badge-dot" /> {copy.badge}
          </motion.span>
          <motion.h1 className="hero-title" {...rise(0.12)}>
            {copy.titleA} <span className="text-gradient">{copy.titleHighlight}</span> {copy.titleB}
          </motion.h1>
          <motion.p className="hero-subtitle" {...rise(0.2)}>
            {copy.subtitle}
          </motion.p>
          <motion.div className="hero-actions" {...rise(0.28)}>
            <button type="button" className="btn btn-gold btn-lg" onClick={() => openBooking()}>
              <Icon name="camera" size={18} /> {copy.ctaPrimary}
            </button>
            <a className="btn btn-glass btn-lg" href={whatsappLink()} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} /> {copy.ctaSecondary}
            </a>
          </motion.div>
          <motion.ul className="hero-trust" {...rise(0.36)}>
            <li>
              <Stars value={SITE.stats.rating} size={15} />
              <span>{copy.ratingLabel.replace("{rating}", SITE.stats.rating).replace("{reviews}", format.number(SITE.stats.reviews))}</span>
            </li>
            <li>
              <strong>{format.number(SITE.stats.procedures)}+</strong> {copy.proceduresLabel}
            </li>
            <li>
              <strong>{SITE.stats.countries}+</strong> {copy.countriesLabel}
            </li>
          </motion.ul>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, delay: 0.2, ease: EASE } }}
        >
          <div className="hero-frame">
            <BeforeAfterSlider item={heroCase} initial={46} />
          </div>
          <motion.div className="hero-chip hero-chip--1" animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
            <Icon name="follicle" size={18} /> {copy.chipGrafts}
          </motion.div>
          <motion.div className="hero-chip hero-chip--2" animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <Icon name="gem" size={18} /> {copy.chipTechnique}
          </motion.div>
          <motion.div className="hero-chip hero-chip--3" animate={{ y: [0, -8, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
            <Icon name="calendar" size={18} /> {copy.chipMonths}
          </motion.div>
          <p className="hero-visual-note">
            <Icon name="info" size={13} /> {t("gallery.illustrative")} · {t("gallery.dragHint")}
          </p>
        </motion.div>
      </div>

      <IstanbulSkyline className="hero-skyline" />
    </section>
  );
}
