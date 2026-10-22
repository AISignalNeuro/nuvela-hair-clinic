import Modal from "../ui/Modal.jsx";
import Icon from "../ui/Icon.jsx";
import QuickBookingForm from "./QuickBookingForm.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";

// Global "free consultation" modal, opened from any CTA via useUI().openBooking(slug?).
export default function BookingModal() {
  const { t } = useI18n();
  const { booking, closeBooking } = useUI();

  return (
    <Modal open={booking.open} onClose={closeBooking} size="lg" labelledBy="booking-modal-title" className="booking-modal">
      <div className="booking-modal-grid">
        <aside className="booking-modal-aside">
          <span className="booking-modal-badge">
            <Icon name="sparkle" size={16} /> {t("booking.free")}
          </span>
          <h2 id="booking-modal-title">{t("booking.modalTitle")}</h2>
          <p>{t("booking.modalSubtitle")}</p>
          <ul className="check-list check-list--light">
            {t("booking.modalPerks").map((perk) => (
              <li key={perk}>
                <Icon name="check" size={16} /> {perk}
              </li>
            ))}
          </ul>
        </aside>
        <div className="booking-modal-form">
          {/* key resets the form state every time the modal opens with a new service */}
          <QuickBookingForm key={`${booking.open}-${booking.service}`} defaultService={booking.service} onDone={closeBooking} idPrefix="modal" />
        </div>
      </div>
    </Modal>
  );
}
