import Icon from "./Icon.jsx";
import { Reveal } from "./Primitives.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { whatsappLink } from "../../utils/contact.js";

// Closing call-to-action used at the bottom of most pages.
export default function CtaBanner({ title, text, service = "" }) {
  const { content } = useI18n();
  const { openBooking } = useUI();
  const copy = content.pages.home.cta;

  return (
    <section className="section section--tight">
      <div className="container">
        <Reveal className="cta-banner">
          <div className="cta-banner-glow" aria-hidden="true" />
          <div className="cta-banner-text">
            <h2>{title ?? copy.title}</h2>
            <p>{text ?? copy.text}</p>
          </div>
          <div className="cta-banner-actions">
            <button type="button" className="btn btn-gold btn-lg" onClick={() => openBooking(service)}>
              <Icon name="camera" size={18} /> {copy.primary}
            </button>
            <a className="btn btn-glass btn-lg" href={whatsappLink()} target="_blank" rel="noreferrer">
              <Icon name="whatsapp" size={18} /> {copy.secondary}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
