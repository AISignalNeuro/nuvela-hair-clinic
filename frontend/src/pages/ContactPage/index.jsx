import { useState } from "react";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { Reveal } from "../../components/ui/Primitives.jsx";
import { Field } from "../../components/booking/fields.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { SITE } from "../../content/shared/site.js";
import { sendContactMessage } from "../../services/clinicService.js";
import { isValidEmail, isValidPhone, whatsappLink } from "../../utils/contact.js";
import { clinicSchema } from "../../utils/schema.js";
import { isDemoMode } from "../../config/app.js";

const SUBJECTS = ["consultation", "pricing", "travel", "other"];

export default function ContactPage() {
  const { t, lang, content, format } = useI18n();
  const { toast } = useUI();
  const copy = content.pages.contactPage;
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", subject: "consultation", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.fullName.trim()) next.fullName = t("booking.wizard.errors.name");
    if (!isValidEmail(form.email)) next.email = t("booking.wizard.errors.email");
    if (form.phone && !isValidPhone(form.phone)) next.phone = t("booking.wizard.errors.phone");
    if (form.message.trim().length < 5) next.message = t("contact.messageError");
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus("sending");
    try {
      await sendContactMessage({ ...form, phone: form.phone || undefined, locale: lang }, lang);
      setStatus("done");
      toast(t("contact.sentText"));
    } catch {
      setStatus("idle");
      toast(t("booking.errorText"), "error");
    }
  };

  const cards = [
    { icon: "whatsapp", label: t("contact.whatsapp"), value: SITE.whatsappDisplay, href: whatsappLink(), ltr: true, accent: true },
    { icon: "phone", label: t("contact.phone"), value: SITE.phone, href: SITE.phoneHref, ltr: true },
    { icon: "mail", label: t("contact.email"), value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "mapPin", label: t("contact.address"), value: `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.district} / ${SITE.address.city}`, href: SITE.mapLinkUrl },
  ];

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/contact" jsonLd={clinicSchema(lang, copy.seoDescription)} />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.contact") }]} />

      <section className="section section--overlap">
        <div className="container contact-cards">
          {cards.map((card, i) => (
            <Reveal key={card.label} delay={i * 0.06}>
              <a className={`contact-card ${card.accent ? "contact-card--accent" : ""}`} href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                <span className="contact-card-icon">
                  <Icon name={card.icon} size={22} />
                </span>
                <span className="contact-card-label">{card.label}</span>
                <span className="contact-card-value" dir={card.ltr ? "ltr" : undefined}>
                  {card.value}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section--tight">
        <div className="container contact-grid">
          <Reveal className="form-card">
            <h2>{t("contact.formTitle")}</h2>
            <p className="muted">{t("contact.formText")}</p>
            {status === "done" ? (
              <div className="booking-success booking-success--inline">
                <span className="booking-success-icon">
                  <Icon name="check" size={30} strokeWidth={2.4} />
                </span>
                <h3>{t("contact.sentTitle")}</h3>
                <p>{t("contact.sentText")}</p>
                {isDemoMode && <p className="demo-note"><Icon name="info" size={14} /> {t("booking.demoMode")}</p>}
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="form-grid">
                  <Field label={t("booking.name")} htmlFor="c-name" error={errors.fullName}>
                    <input id="c-name" autoComplete="name" value={form.fullName} onChange={set("fullName")} />
                  </Field>
                  <Field label={t("booking.email")} htmlFor="c-email" error={errors.email}>
                    <input id="c-email" type="email" dir="ltr" autoComplete="email" value={form.email} onChange={set("email")} />
                  </Field>
                  <Field label={t("booking.phone")} htmlFor="c-phone" error={errors.phone} optional>
                    <input id="c-phone" type="tel" dir="ltr" autoComplete="tel" value={form.phone} onChange={set("phone")} />
                  </Field>
                  <Field label={t("contact.subject")} htmlFor="c-subject">
                    <select id="c-subject" value={form.subject} onChange={set("subject")}>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{t(`contact.subjects.${s}`)}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label={t("contact.message")} htmlFor="c-message" error={errors.message}>
                  <textarea id="c-message" rows={5} value={form.message} onChange={set("message")} />
                </Field>
                <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
                  {status === "sending" ? <span className="spinner" aria-hidden="true" /> : <Icon name="mail" size={18} />}
                  {status === "sending" ? t("booking.sending") : t("contact.send")}
                </button>
              </form>
            )}
          </Reveal>

          <Reveal className="contact-side" delay={0.08}>
            <div className="info-card info-card--dark">
              <h3>
                <Icon name="clock" size={18} /> {t("contact.hours")}
              </h3>
              <dl className="hours-list">
                {SITE.hours.map((h) => (
                  <div key={h.days}>
                    <dt>{t(`contact.days.${h.days}`)}</dt>
                    <dd dir="ltr">{h.open ? `${h.open} – ${h.close}` : t("contact.byAppointment")}</dd>
                  </div>
                ))}
              </dl>
              <p className="info-card-note">
                <Icon name="headset" size={16} /> {t("contact.support")}
              </p>
              <h3>
                <Icon name="chat" size={18} /> {t("contact.languages")}
              </h3>
              <p>{["en", "tr", "ar", "de"].map((c) => format.language(c)).join(" · ")}</p>
            </div>
            <div className="map-card">
              <iframe title={t("contact.mapTitle")} src={SITE.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <a className="btn btn-ghost btn-sm" href={SITE.mapLinkUrl} target="_blank" rel="noreferrer">
                <Icon name="mapPin" size={16} /> {t("contact.openMap")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
