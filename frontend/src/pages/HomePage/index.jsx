import Seo from "../../components/ui/Seo.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import HomeHero from "../../components/home/HomeHero.jsx";
import {
  BlogSection,
  FaqSection,
  JourneySection,
  PackagesSection,
  ResultsSection,
  ServicesSection,
  TeamSection,
  TestimonialsSection,
  TrustMarquee,
  WhySection,
} from "../../components/home/HomeSections.jsx";
import { faqSchema } from "../../components/ui/Accordion.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { clinicSchema } from "../../utils/schema.js";

export default function HomePage() {
  const { content, lang, t } = useI18n();
  return (
    <>
      <Seo
        title={content.pages.home.seoTitle}
        description={t("meta.defaultDescription")}
        path="/"
        jsonLd={[clinicSchema(lang, t("meta.defaultDescription")), faqSchema(content.faqs.slice(0, 6))]}
      />
      <HomeHero />
      <TrustMarquee />
      <ServicesSection />
      <WhySection />
      <JourneySection />
      <ResultsSection />
      <PackagesSection />
      <TestimonialsSection />
      <TeamSection />
      <FaqSection />
      <BlogSection />
      <CtaBanner />
    </>
  );
}
