import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import BookingSuccess from "./BookingSuccess.jsx";
import { ChoiceChips, CountrySelect, Field } from "./fields.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createAppointment } from "../../services/clinicService.js";
import { isValidEmail, isValidPhone } from "../../utils/contact.js";

const STEPS = ["treatment", "hair", "travel", "contact", "review"];
const CONCERNS = ["hairline", "crown", "diffuse", "beard", "eyebrow", "repair"];
const DURATIONS = ["lt1", "y1to3", "y3to5", "gt5"];

// Multi-step consultation request: treatment → hair → travel → contact → review.
export default function BookingWizard({ initialService = "" }) {
  const { t, lang, content, format } = useI18n();
  const { user } = useAuth();
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState(null);
  const [data, setData] = useState({
    service: initialService,
    concern: "hairline",
    duration: "y1to3",
    previous: "no",
    date: "",
    flexible: true,
    companions: "0",
    airport: "IST",
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    country: "",
    channel: "whatsapp",
    note: "",
    consent: false,
  });

  const set = (key) => (value) => setData((d) => ({ ...d, [key]: value }));
  const w = (key, vars) => t(`booking.wizard.${key}`, vars);

  const validate = (index) => {
    const next = {};
    if (STEPS[index] === "contact") {
      if (!data.fullName.trim()) next.fullName = w("errors.name");
      if (!isValidPhone(data.phone)) next.phone = w("errors.phone");
      if (data.email && !isValidEmail(data.email)) next.email = w("errors.email");
      if (!data.consent) next.consent = w("errors.consent");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const go = (target) => {
    if (target > step && !validate(step)) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!validate(3)) {
      go(3);
      return;
    }
    setStatus("sending");
    try {
      const result = await createAppointment(
        {
          fullName: data.fullName.trim(),
          phone: data.phone.trim(),
          email: data.email.trim() || undefined,
          country: data.country || undefined,
          serviceSlug: data.service || undefined,
          contactChannel: data.channel,
          preferredDate: data.flexible || !data.date ? undefined : data.date,
          companions: Number(data.companions),
          airport: data.airport,
          concern: data.concern,
          hairLossDuration: data.duration,
          previousTransplant: data.previous === "yes",
          note: data.note.trim() || undefined,
          source: "booking-wizard",
          locale: lang,
        },
        lang,
      );
      setReference(result.reference ?? result.id);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="wizard wizard--done">
        <BookingSuccess reference={reference} />
        <LocalizedLink to="/" className="btn btn-ghost">
          {t("common.backHome")}
        </LocalizedLink>
      </div>
    );
  }

  const service = content.serviceBySlug[data.service];
  const summary = [
    { label: w("summary.treatment"), value: service?.title ?? w("unsure"), step: 0 },
    { label: w("summary.concern"), value: w(`concerns.${data.concern}`), step: 1 },
    { label: w("summary.duration"), value: w(`durations.${data.duration}`), step: 1 },
    { label: w("summary.previous"), value: t(`common.${data.previous}`), step: 1 },
    { label: w("summary.date"), value: data.flexible || !data.date ? w("flexible") : format.date(data.date), step: 2 },
    { label: w("summary.companions"), value: w(`companions.${data.companions}`), step: 2 },
    { label: w("summary.airport"), value: w(`airports.${data.airport}`), step: 2 },
    { label: w("summary.contact"), value: [data.fullName, data.phone, data.email].filter(Boolean).join(" · "), step: 3 },
  ];

  return (
    <div className="wizard">
      <ol className="wizard-steps" aria-label={w("stepOf", { current: step + 1, total: STEPS.length })}>
        {STEPS.map((key, i) => (
          <li key={key} className={i === step ? "is-current" : i < step ? "is-done" : ""}>
            <button type="button" onClick={() => i < step && go(i)} disabled={i > step} aria-current={i === step ? "step" : undefined}>
              <span className="wizard-dot">{i < step ? <Icon name="check" size={14} strokeWidth={2.4} /> : i + 1}</span>
              <span className="wizard-step-label">{w(`steps.${key}`)}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="wizard-progress">
        <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <div className="wizard-body">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: 30 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 * direction }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <fieldset>
                <legend>{w("treatmentTitle")}</legend>
                <p className="muted">{w("treatmentHint")}</p>
                <div className="option-grid">
                  {[...content.services, { slug: "", title: w("unsure"), icon: "info", summary: "" }].map((s) => (
                    <button
                      key={s.slug || "unsure"}
                      type="button"
                      className={`option-card ${data.service === s.slug ? "is-active" : ""}`}
                      onClick={() => {
                        set("service")(s.slug);
                        setDirection(1);
                        setStep(1);
                      }}
                    >
                      <span className="option-card-icon">
                        <Icon name={s.icon} size={22} />
                      </span>
                      <span className="option-card-title">{s.shortTitle ?? s.title}</span>
                      {s.priceFrom && <span className="option-card-meta">{t("common.from")} {format.price(s.priceFrom)}</span>}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend>{w("hairTitle")}</legend>
                <Field label={w("concernLabel")}>
                  <ChoiceChips name="concern" value={data.concern} onChange={set("concern")} options={CONCERNS.map((c) => ({ value: c, label: w(`concerns.${c}`) }))} />
                </Field>
                <Field label={w("durationLabel")}>
                  <ChoiceChips name="duration" value={data.duration} onChange={set("duration")} options={DURATIONS.map((d) => ({ value: d, label: w(`durations.${d}`) }))} />
                </Field>
                <Field label={w("previousLabel")}>
                  <ChoiceChips name="previous" value={data.previous} onChange={set("previous")} options={["no", "yes"].map((v) => ({ value: v, label: t(`common.${v}`) }))} />
                </Field>
                <p className="hint-box">
                  <Icon name="camera" size={18} /> {w("photosHint")}
                </p>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend>{w("travelTitle")}</legend>
                <div className="form-grid">
                  <Field label={w("dateLabel")} htmlFor="wz-date">
                    <input id="wz-date" type="date" value={data.date} min={new Date().toISOString().slice(0, 10)} disabled={data.flexible} onChange={(e) => set("date")(e.target.value)} />
                  </Field>
                  <Field label={" "}>
                    <label className="checkbox">
                      <input type="checkbox" checked={data.flexible} onChange={(e) => set("flexible")(e.target.checked)} />
                      <span>{w("flexible")}</span>
                    </label>
                  </Field>
                </div>
                <Field label={w("companionsLabel")}>
                  <ChoiceChips name="companions" value={data.companions} onChange={set("companions")} options={["0", "1", "2"].map((v) => ({ value: v, label: w(`companions.${v}`) }))} />
                </Field>
                <Field label={w("airportLabel")}>
                  <ChoiceChips name="airport" value={data.airport} onChange={set("airport")} options={["IST", "SAW", "unknown"].map((v) => ({ value: v, label: w(`airports.${v}`), icon: "plane" }))} />
                </Field>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend>{w("contactTitle")}</legend>
                <div className="form-grid">
                  <Field label={t("booking.name")} htmlFor="wz-name" error={errors.fullName}>
                    <input id="wz-name" autoComplete="name" value={data.fullName} placeholder={t("booking.placeholders.name")} onChange={(e) => set("fullName")(e.target.value)} />
                  </Field>
                  <Field label={t("booking.phone")} htmlFor="wz-phone" error={errors.phone}>
                    <input id="wz-phone" type="tel" dir="ltr" autoComplete="tel" value={data.phone} placeholder={t("booking.placeholders.phone")} onChange={(e) => set("phone")(e.target.value)} />
                  </Field>
                  <Field label={t("booking.email")} htmlFor="wz-email" error={errors.email} optional>
                    <input id="wz-email" type="email" dir="ltr" autoComplete="email" value={data.email} placeholder={t("booking.placeholders.email")} onChange={(e) => set("email")(e.target.value)} />
                  </Field>
                  <Field label={t("booking.country")} htmlFor="wz-country" optional>
                    <CountrySelect id="wz-country" value={data.country} onChange={set("country")} />
                  </Field>
                </div>
                <Field label={t("booking.preferredContact")}>
                  <ChoiceChips
                    name="channel"
                    value={data.channel}
                    onChange={set("channel")}
                    options={["whatsapp", "phone", "email"].map((v) => ({ value: v, label: t(`booking.channels.${v}`), icon: v === "phone" ? "phone" : v === "email" ? "mail" : "whatsapp" }))}
                  />
                </Field>
                <Field label={t("booking.message")} htmlFor="wz-note" optional>
                  <textarea id="wz-note" rows={3} value={data.note} placeholder={t("booking.placeholders.message")} onChange={(e) => set("note")(e.target.value)} />
                </Field>
                <Field error={errors.consent}>
                  <label className="checkbox">
                    <input type="checkbox" checked={data.consent} onChange={(e) => set("consent")(e.target.checked)} />
                    <span>{t("booking.consent")}</span>
                  </label>
                </Field>
              </fieldset>
            )}

            {step === 4 && (
              <fieldset>
                <legend>{w("reviewTitle")}</legend>
                <p className="muted">{w("reviewText")}</p>
                <dl className="review-list">
                  {summary.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                      <button type="button" className="link-btn" onClick={() => go(row.step)}>
                        {w("edit")}
                      </button>
                    </div>
                  ))}
                </dl>
                {status === "error" && (
                  <p className="form-alert" role="alert">
                    <Icon name="info" size={16} /> {t("booking.errorText")}
                  </p>
                )}
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="wizard-nav">
        {step > 0 ? (
          <button type="button" className="btn btn-ghost" onClick={() => go(step - 1)}>
            <Icon name="arrowLeft" size={16} /> {t("common.back")}
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>
            {t("common.next")} <Icon name="arrowRight" size={16} />
          </button>
        ) : (
          <button type="button" className="btn btn-gold btn-lg" onClick={submit} disabled={status === "sending"}>
            {status === "sending" ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkle" size={18} />}
            {status === "sending" ? t("booking.sending") : t("booking.submit")}
          </button>
        )}
      </div>
    </div>
  );
}
