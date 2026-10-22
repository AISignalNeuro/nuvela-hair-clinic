// Home page sections below the hero. Each one is self-contained and reads its copy
// from content.pages.home so all three languages share the same markup.
import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import Accordion from "../ui/Accordion.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { Reveal, SectionHeader, Stars } from "../ui/Primitives.jsx";
import ServiceCard from "../services/ServiceCard.jsx";
import CaseCard from "../gallery/CaseCard.jsx";
import CaseModal from "../gallery/CaseModal.jsx";
import PackageCard from "../packages/PackageCard.jsx";
import BlogCard from "../blog/BlogCard.jsx";
import DoctorCard from "../about/DoctorCard.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useCountUp } from "../../hooks/index.js";
import { stagger, fadeInUp } from "../../config/motion.js";
import { SITE } from "../../content/shared/site.js";

export function TrustMarquee() {
  const { content } = useI18n();
  const items = content.pages.home.trust;
  const icons = ["shield", "user", "award", "globe", "heart"];
  // Duplicated list makes the CSS marquee loop seamlessly.
  return (
    <div className="trust-marquee" aria-label="Highlights">
      <div className="trust-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="trust-item" aria-hidden={i >= items.length}>
            <Icon name={icons[i % icons.length]} size={18} /> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ServicesSection() {
  const { t, content } = useI18n();
  const copy = content.pages.home.services;
  return (
    <section className="section" id="treatments">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <motion.div className="grid grid--3" variants={stagger()} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
          {content.services.filter((s) => s.featured).map((service) => (
            <motion.div key={service.slug} variants={fadeInUp}>
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </motion.div>
        <div className="section-cta">
          <LocalizedLink to="/services" className="btn btn-ghost">
            {t("nav.allTreatments")} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, suffix = "", decimals = 0, label }) {
  const { format } = useI18n();
  const [ref, current] = useCountUp(value);
  const shown = decimals ? current.toFixed(decimals) : format.number(Math.round(current));
  return (
    <div className="stat" ref={ref}>
      <span className="stat-value">
        {shown}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export function WhySection() {
  const { content } = useI18n();
  const copy = content.pages.home.why;
  return (
    <section className="section section--sand" id="why">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="stats-bar glass">
          <Stat value={SITE.stats.procedures} suffix="+" label={copy.stats.procedures} />
          <Stat value={SITE.stats.countries} suffix="+" label={copy.stats.countries} />
          <Stat value={SITE.stats.years} label={copy.stats.years} />
          <Stat value={SITE.stats.rating} decimals={1} suffix="/5" label={copy.stats.rating} />
        </div>
        <motion.div className="grid grid--3 why-grid" variants={stagger(0.07)} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          {copy.items.map((item) => (
            <motion.article key={item.title} className="feature-card" variants={fadeInUp}>
              <span className="feature-icon">
                <Icon name={item.icon} size={24} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function JourneySection() {
  const { content } = useI18n();
  const copy = content.pages.home.journey;
  return (
    <section className="section section--dark" id="journey">
      <div className="section-dark-glow" aria-hidden="true" />
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} light />
        <ol className="journey">
          {copy.steps.map((step, i) => (
            <Reveal as="li" key={step.title} className="journey-step" delay={i * 0.08}>
              <span className="journey-index">{String(i + 1).padStart(2, "0")}</span>
              <span className="journey-meta">{step.meta}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ResultsSection() {
  const { content } = useI18n();
  const copy = content.pages.home.results;
  const [active, setActive] = useState(null);
  const featured = content.cases.filter((c) => c.featured).slice(0, 3);
  return (
    <section className="section" id="results">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="grid grid--3">
          {featured.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.08}>
              <CaseCard item={item} onOpen={setActive} />
            </Reveal>
          ))}
        </div>
        <div className="section-cta">
          <LocalizedLink to="/gallery" className="btn btn-primary">
            {copy.cta} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
      </div>
      <CaseModal item={active} onClose={() => setActive(null)} />
    </section>
  );
}

export function PackagesSection() {
  const { content } = useI18n();
  const copy = content.pages.home.packages;
  return (
    <section className="section section--mint" id="packages">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="grid grid--3 packages-grid">
          {content.packages.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i * 0.08}>
              <PackageCard pkg={pkg} compact />
            </Reveal>
          ))}
        </div>
        <div className="section-cta">
          <LocalizedLink to="/packages" className="btn btn-ghost">
            {copy.cta} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { t, content, format } = useI18n();
  const copy = content.pages.home.testimonials;
  return (
    <section className="section" id="stories">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title.replace("{countries}", SITE.stats.countries)} subtitle={copy.subtitle} />
        <div className="testimonial-grid">
          {content.testimonials.map((item, i) => (
            <Reveal key={item.id} className="testimonial-card" delay={(i % 3) * 0.08}>
              <Icon name="quote" size={30} className="testimonial-quote" />
              <Stars value={item.rating} />
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-author">
                <span className="testimonial-initial">{item.name.charAt(0)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {format.country(item.country)} · {content.serviceBySlug[item.service]?.shortTitle}
                  </small>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="fine-print">
          <Icon name="info" size={14} /> {t("footer.demo")}
        </p>
      </div>
    </section>
  );
}

export function TeamSection() {
  const { content } = useI18n();
  const copy = content.pages.home.team;
  return (
    <section className="section section--sand" id="team">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="grid grid--4">
          {content.doctors.map((doctor, i) => (
            <Reveal key={doctor.slug} delay={i * 0.06}>
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>
        <div className="section-cta">
          <LocalizedLink to="/about" className="btn btn-ghost">
            {copy.cta} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { content } = useI18n();
  const copy = content.pages.home.faq;
  const items = content.faqs.slice(0, 6);
  return (
    <section className="section" id="faq">
      <div className="container faq-split">
        <div>
          <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} align="start" />
          <LocalizedLink to="/faq" className="btn btn-primary">
            {copy.cta} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
        <Accordion items={items} />
      </div>
    </section>
  );
}

export function BlogSection() {
  const { content } = useI18n();
  const copy = content.pages.home.blog;
  return (
    <section className="section section--sand" id="journal">
      <div className="container">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <div className="grid grid--3">
          {content.posts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
        <div className="section-cta">
          <LocalizedLink to="/blog" className="btn btn-ghost">
            {copy.cta} <Icon name="arrowRight" size={16} />
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
}
