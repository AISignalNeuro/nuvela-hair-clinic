import { useState } from "react";
import Icon from "../ui/Icon.jsx";
import { ChoiceChips, CountrySelect, Field, ServiceSelect } from "./fields.jsx";
import BookingSuccess from "./BookingSuccess.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { createAppointment } from "../../services/clinicService.js";
import { isValidEmail, isValidPhone } from "../../utils/contact.js";

// Short consultation form used in the global booking modal and on landing sections.
export default function QuickBookingForm({ defaultService = "", onDone, idPrefix = "qb" }) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    country: "",
    service: defaultService,
    channel: "whatsapp",
    note: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [reference, setReference] = useState(null);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const id = (name) => `${idPrefix}-${name}`;

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = t("booking.wizard.errors.name");
    if (!isValidPhone(form.phone)) next.phone = t("booking.wizard.errors.phone");
    if (form.email && !isValidEmail(form.email)) next.email = t("booking.wizard.errors.email");
    if (!form.consent) next.consent = t("booking.wizard.errors.consent");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const result = await createAppointment(
        {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          country: form.country || undefined,
          serviceSlug: form.service || undefined,
          contactChannel: form.channel,
          note: form.note.trim() || undefined,
          source: "quick-form",
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

  if (status === "done") return <BookingSuccess reference={reference} onDone={onDone} />;

  return (
    <form className="quick-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label={t("booking.name")} htmlFor={id("name")} error={errors.fullName}>
          <input id={id("name")} autoComplete="name" value={form.fullName} placeholder={t("booking.placeholders.name")} onChange={(e) => set("fullName")(e.target.value)} />
        </Field>
        <Field label={t("booking.phone")} htmlFor={id("phone")} error={errors.phone}>
          <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={form.phone} placeholder={t("booking.placeholders.phone")} onChange={(e) => set("phone")(e.target.value)} />
        </Field>
        <Field label={t("booking.email")} htmlFor={id("email")} error={errors.email} optional>
          <input id={id("email")} type="email" autoComplete="email" dir="ltr" value={form.email} placeholder={t("booking.placeholders.email")} onChange={(e) => set("email")(e.target.value)} />
        </Field>
        <Field label={t("booking.country")} htmlFor={id("country")} optional>
          <CountrySelect id={id("country")} value={form.country} onChange={set("country")} />
        </Field>
      </div>
      <Field label={t("booking.service")} htmlFor={id("service")}>
        <ServiceSelect id={id("service")} value={form.service} onChange={set("service")} />
      </Field>
      <Field label={t("booking.preferredContact")}>
        <ChoiceChips
          name={id("channel")}
          value={form.channel}
          onChange={set("channel")}
          options={[
            { value: "whatsapp", label: t("booking.channels.whatsapp"), icon: "whatsapp" },
            { value: "phone", label: t("booking.channels.phone"), icon: "phone" },
            { value: "email", label: t("booking.channels.email"), icon: "mail" },
          ]}
        />
      </Field>
      <Field label={t("booking.message")} htmlFor={id("note")} optional>
        <textarea id={id("note")} rows={3} value={form.note} placeholder={t("booking.placeholders.message")} onChange={(e) => set("note")(e.target.value)} />
      </Field>
      <Field error={errors.consent}>
        <label className="checkbox">
          <input type="checkbox" checked={form.consent} onChange={(e) => set("consent")(e.target.checked)} />
          <span>
            {t("booking.consent")} <LocalizedLink to="/privacy">↗</LocalizedLink>
          </span>
        </label>
      </Field>
      {status === "error" && (
        <p className="form-alert" role="alert">
          <Icon name="info" size={16} /> {t("booking.errorText")}
        </p>
      )}
      <button type="submit" className="btn btn-primary btn-lg w-100" disabled={status === "sending"}>
        {status === "sending" ? <span className="spinner" aria-hidden="true" /> : <Icon name="sparkle" size={18} />}
        {status === "sending" ? t("booking.sending") : t("booking.submit")}
      </button>
    </form>
  );
}
