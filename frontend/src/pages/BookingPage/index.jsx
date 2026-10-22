import { useSearchParams } from "react-router-dom";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import BookingWizard from "../../components/booking/BookingWizard.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";

export default function BookingPage() {
  const { t, content } = useI18n();
  const copy = content.pages.bookingPage;
  const [params] = useSearchParams();
  const service = content.serviceBySlug[params.get("service")] ? params.get("service") : "";

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/booking" />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.book") }]}>
        <ul className="hero-perks">
          {copy.perks.map((perk) => (
            <li key={perk}>
              <Icon name="check" size={16} /> {perk}
            </li>
          ))}
        </ul>
      </PageHero>
      <section className="section section--overlap">
        <div className="container narrow">
          <div className="wizard-card">
            <BookingWizard initialService={service} />
          </div>
        </div>
      </section>
    </>
  );
}
