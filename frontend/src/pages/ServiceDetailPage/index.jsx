import { useState } from "react";
import { useParams } from "react-router-dom";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import Accordion, { faqSchema } from "../../components/ui/Accordion.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import ScalpArt from "../../components/ui/ScalpArt.jsx";
import LocalizedLink from "../../components/ui/LocalizedLink.jsx";
import { breadcrumbSchema } from "../../components/ui/Breadcrumbs.jsx";
import { Reveal, SectionHeader } from "../../components/ui/Primitives.jsx";
import ServiceCard from "../../components/services/ServiceCard.jsx";
import CaseCard from "../../components/gallery/CaseCard.jsx";
import CaseModal from "../../components/gallery/CaseModal.jsx";
import NotFoundPage from "../NotFoundPage/index.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useScrollSpy } from "../../hooks/index.js";
import { formatFact } from "../../utils/format.js";
import { procedureSchema } from "../../utils/schema.js";
import { whatsappLink } from "../../utils/contact.js";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { content } = useI18n();
  const service = content.serviceBySlug[slug];
  if (!service) return <NotFoundPage />;
  return <ServiceDetail key={slug} service={service} />;
}

function ServiceDetail({ service }) {
  const { t, lang, content, format } = useI18n();
  const { openBooking } = useUI();
  const [activeCase, setActiveCase] = useState(null);

  const toc = [
    ...service.sections.map((s) => ({ id: s.id, label: s.heading })),
    { id: "benefits", label: t("services.detail.benefits") },
    { id: "steps", label: t("services.detail.steps") },
    { id: "faq", label: t("services.detail.faqTitle") },
  ];
  const activeId = useScrollSpy(toc.map((item) => item.id));

  const cases = content.cases.filter((c) => c.service === service.slug).slice(0, 3);
  const related = content.services.filter((s) => s.slug !== service.slug && (s.category === service.category || s.category === "treatment")).slice(0, 3);
  const faqItems = service.faqs.map((f, i) => ({ id: `sfaq-${i}`, ...f }));
  const crumbs = [
    { label: t("nav.treatments"), to: "/services" },
    { label: service.shortTitle, to: `/services/${service.slug}` },
  ];
  const price = format.price(service.priceFrom);

  return (
    <>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        path={`/services/${service.slug}`}
        jsonLd={[procedureSchema(lang, service), faqSchema(service.faqs), breadcrumbSchema(lang, [{ label: t("common.home"), to: "/" }, ...crumbs])]}
      />
      <PageHero
        eyebrow={t(`categories.${service.category}`)}
        title={service.title}
        subtitle={service.tagline}
        crumbs={crumbs}
        aside={
          <div className="service-hero-art">
            <ScalpArt variant={service.art} stage="after" severity={2} seed={service.slug.length * 7} />
            <span className="service-hero-icon">
              <Icon name={service.icon} size={28} />
            </span>
          </div>
        }
      >
        <div className="service-hero-facts">
          {service.facts.slice(0, 3).map((fact) => (
            <span key={fact.key} className="glass-pill">
              <strong>{formatFact(fact, t)}</strong> {t(`facts.${fact.key}`)}
            </span>
          ))}
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-gold btn-lg" onClick={() => openBooking(service.slug)}>
            <Icon name="calendar" size={18} /> {t("common.freeConsultation")}
          </button>
          <a className="btn btn-glass btn-lg" href={whatsappLink(`${service.title}: ${t("services.detail.askDoctor")}`)} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} /> {t("services.detail.askDoctor")}
          </a>
        </div>
      </PageHero>

      <section className="section">
        <div className="container detail-layout">
          <aside className="detail-toc" aria-label={t("services.detail.toc")}>
            <div className="toc-card">
              <p className="toc-title">{t("services.detail.toc")}</p>
              <ol>
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className={activeId === item.id ? "is-active" : ""} onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="detail-content prose">
            <p className="lead">{service.intro}</p>
            {service.sections.map((section) => (
              <section key={section.id} id={section.id} className="prose-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="check-list">
                    {section.bullets.map((b) => (
                      <li key={b}>
                        <Icon name="check" size={16} /> {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <section id="benefits" className="prose-section">
              <div className="split-cards">
                <div className="info-card info-card--mint">
                  <h2>{t("services.detail.benefits")}</h2>
                  <ul className="check-list">
                    {service.benefits.map((b) => (
                      <li key={b}>
                        <Icon name="check" size={16} /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="info-card info-card--sand">
                  <h2>{t("services.detail.candidates")}</h2>
                  <ul className="check-list">
                    {service.candidates.map((c) => (
                      <li key={c}>
                        <Icon name="user" size={16} /> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section id="steps" className="prose-section">
              <h2>{t("services.detail.steps")}</h2>
              <ol className="step-list">
                {service.steps.map((step, i) => (
                  <li key={step.title}>
                    <span className="step-num">{i + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="faq" className="prose-section">
              <h2>{t("services.detail.faqTitle")}</h2>
              <Accordion items={faqItems} />
            </section>
          </article>

          <aside className="detail-sidebar">
            <div className="price-card">
              <p className="price-card-label">{t("services.detail.priceTitle")}</p>
              <p className="price-card-value">
                {price}
                {service.priceUnit === "session" && <small> {t("common.perSession")}</small>}
              </p>
              <p className="price-card-text">{t("services.detail.priceText")}</p>
              <button type="button" className="btn btn-gold w-100" onClick={() => openBooking(service.slug)}>
                {t("common.freeConsultation")}
              </button>
              <a className="btn btn-whatsapp w-100" href={whatsappLink(service.title)} target="_blank" rel="noreferrer">
                <Icon name="whatsapp" size={18} /> {t("common.whatsapp")}
              </a>
              <p className="price-card-note">{t("common.priceNote")}</p>
            </div>
            <div className="facts-card">
              <p className="facts-card-title">{t("services.detail.facts")}</p>
              <dl>
                {service.facts.map((fact) => (
                  <div key={fact.key}>
                    <dt>{t(`facts.${fact.key}`)}</dt>
                    <dd>{formatFact(fact, t)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {cases.length > 0 && (
        <section className="section section--sand">
          <div className="container">
            <SectionHeader title={t("services.detail.relatedCases")} />
            <div className="grid grid--3">
              {cases.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.08}>
                  <CaseCard item={item} onOpen={setActiveCase} />
                </Reveal>
              ))}
            </div>
            <div className="section-cta">
              <LocalizedLink to="/gallery" className="btn btn-ghost">
                {content.pages.home.results.cta} <Icon name="arrowRight" size={16} />
              </LocalizedLink>
            </div>
          </div>
          <CaseModal item={activeCase} onClose={() => setActiveCase(null)} />
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHeader title={t("services.detail.relatedServices")} />
          <div className="grid grid--3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner service={service.slug} />
    </>
  );
}
