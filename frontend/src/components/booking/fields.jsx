import { useMemo } from "react";
import Icon from "../ui/Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";

const COUNTRY_CODES = ["GB", "DE", "NL", "FR", "IE", "BE", "CH", "AT", "IT", "ES", "SE", "NO", "DK", "PL", "US", "CA", "AU", "SA", "AE", "QA", "KW", "BH", "OM", "IQ", "EG", "MA", "DZ", "TR"];

export function Field({ label, error, hint, optional, htmlFor, children, className = "" }) {
  const { t } = useI18n();
  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      {label && (
        <label htmlFor={htmlFor}>
          {label}
          {optional && <span className="field-optional"> ({t("common.optional")})</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="field-error" role="alert">
          <Icon name="info" size={14} /> {error}
        </p>
      ) : (
        hint && <p className="field-hint">{hint}</p>
      )}
    </div>
  );
}

export function CountrySelect({ id, value, onChange }) {
  const { format, lang } = useI18n();
  const options = useMemo(
    () => COUNTRY_CODES.map((code) => ({ code, name: format.country(code) })).sort((a, b) => a.name.localeCompare(b.name, lang)),
    [format, lang],
  );
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">-</option>
      {options.map((o) => (
        <option key={o.code} value={o.code}>
          {o.name}
        </option>
      ))}
    </select>
  );
}

export function ServiceSelect({ id, value, onChange, allowUnsure = true }) {
  const { content, t } = useI18n();
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      {allowUnsure && <option value="">{t("booking.wizard.unsure")}</option>}
      {content.services.map((s) => (
        <option key={s.slug} value={s.slug}>
          {s.title}
        </option>
      ))}
    </select>
  );
}

export function ChoiceChips({ name, value, onChange, options }) {
  return (
    <div className="choice-chips" role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className={`choice-chip ${value === o.value ? "is-active" : ""}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          {o.icon && <Icon name={o.icon} size={16} />}
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}
