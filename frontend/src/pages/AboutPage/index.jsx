import { useState } from "react";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import Modal from "../../components/ui/Modal.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import IstanbulSkyline from "../../components/ui/IstanbulSkyline.jsx";
import { Avatar, Reveal, SectionHeader } from "../../components/ui/Primitives.jsx";
import DoctorCard from "../../components/about/DoctorCard.jsx";
import { WhySection, TestimonialsSection } from "../../components/home/HomeSections.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { SITE } from "../../content/shared/site.js";
import { clinicSchema } from "../../utils/schema.js";

export default function AboutPage() {
  const { t, lang, content, format } = useI18n();
  const copy = content.pages.about;
  const [doctor, setDoctor] = useState(null);

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/about" jsonLd={clinicSchema(lang, copy.seoDescription)} />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.about") }]} />

      <section className="section">
        <div className="container story-grid">
          <Reveal className="story-text">
            <span className="eyebrow">{copy.storyTitle}</span>
            {copy.story.map((p) => (
              <p key={p} className="lead">{p}</p>
            ))}
            <div className="story-stats">
              <div>
                <strong>{format.number(SITE.stats.procedures)}+</strong>
                <span>{content.pages.home.why.stats.procedures}</span>
              </div>
              <div>
                <strong>{SITE.stats.countries}+</strong>
                <span>{content.pages.home.why.stats.countries}</span>
              </div>
              <div>
                <strong>{SITE.stats.years}</strong>
                <span>{content.pages.home.why.stats.years}</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="story-visual" delay={0.1}>
            <div className="story-card">
              <IstanbulSkyline className="story-skyline" />
              <div className="story-card-body">
                <p className="story-card-title">{copy.facilityTitle}</p>
                <ul className="check-list check-list--light">
                  {copy.facility.map((f) => (
                    <li key={f}>
                      <Icon name="check" size={16} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--mint">
        <div className="container">
          <SectionHeader title={copy.valuesTitle} />
          <div className="grid grid--3">
            {copy.values.map((v, i) => (
              <Reveal key={v.title} className="feature-card" delay={i * 0.06}>
                <span className="feature-icon">
                  <Icon name={v.icon} size={24} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="team">
        <div className="container">
          <SectionHeader title={copy.teamTitle} subtitle={copy.teamSubtitle} />
          <div className="grid grid--4">
            {content.doctors.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.06}>
                <button type="button" className="card-button" onClick={() => setDoctor(d)} aria-label={d.name}>
                  <DoctorCard doctor={d} />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhySection />
      <TestimonialsSection />
      <CtaBanner />

      <Modal open={!!doctor} onClose={() => setDoctor(null)} size="md" labelledBy="doctor-modal-title">
        {doctor && (
          <div className="doctor-modal">
            <Avatar initials={doctor.initials} hue={doctor.hue} size={88} />
            <h2 id="doctor-modal-title">{doctor.name}</h2>
            <p className="doctor-role">{doctor.role}</p>
            <p>{doctor.bio}</p>
            <div className="tag-row tag-row--center">
              {doctor.specialties.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
            <p className="doctor-modal-langs">
              <Icon name="chat" size={16} /> {doctor.languages.map((code) => format.language(code)).join(" · ")}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
