import Modal from "../ui/Modal.jsx";
import Icon from "../ui/Icon.jsx";
import BeforeAfterSlider from "../ui/BeforeAfterSlider.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";

export default function CaseModal({ item, onClose }) {
  const { t, format } = useI18n();
  const { openBooking } = useUI();
  if (!item) return <Modal open={false} onClose={onClose} />;

  const service = item.serviceData;
  const facts = [
    { icon: "follicle", label: t("gallery.graftsLabel"), value: format.number(item.grafts) },
    { icon: service?.icon ?? "gem", label: t("gallery.technique"), value: service?.shortTitle },
    { icon: "calendar", label: t("gallery.resultAt"), value: t("gallery.monthsAfter", { n: item.months }) },
    { icon: "user", label: t("gallery.age"), value: `${item.age} · ${t(`gallery.gender.${item.gender}`)}` },
    { icon: "globe", label: t("gallery.origin"), value: format.country(item.country) },
  ];

  return (
    <Modal open={!!item} onClose={onClose} size="xl" labelledBy="case-modal-title" className="case-modal">
      <div className="case-modal-grid">
        <div className="case-modal-visual">
          <BeforeAfterSlider item={item} />
          <p className="case-modal-note">
            <Icon name="info" size={14} /> {t("gallery.illustrativeNote")}
          </p>
        </div>
        <div className="case-modal-info">
          <span className="eyebrow">{t(`categories.${service?.category}`)}</span>
          <h2 id="case-modal-title">{t("gallery.caseTitle", { grafts: format.number(item.grafts), service: service?.shortTitle })}</h2>
          <p className="case-modal-highlight">{item.highlight}</p>
          <dl className="fact-list">
            {facts.map((f) => (
              <div key={f.label} className="fact-list-item">
                <dt>
                  <Icon name={f.icon} size={16} /> {f.label}
                </dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="tag-row">
            {item.tags?.map((tag) => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          <div className="case-modal-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                openBooking(item.service);
              }}
            >
              {t("gallery.bookThis")}
            </button>
            {service && (
              <LocalizedLink to={`/services/${service.slug}`} className="btn btn-ghost" onClick={onClose}>
                {service.shortTitle} <Icon name="arrowRight" size={16} />
              </LocalizedLink>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
