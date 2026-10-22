import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import { Chip, Reveal, SectionHeader } from "../../components/ui/Primitives.jsx";
import ServiceCard from "../../components/services/ServiceCard.jsx";
import { JourneySection } from "../../components/home/HomeSections.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { SERVICE_CATEGORIES } from "../../content/shared/services.js";

export default function ServicesPage() {
  const { t, content } = useI18n();
  const copy = content.pages.servicesPage;
  const [params, setParams] = useSearchParams();
  const category = SERVICE_CATEGORIES.includes(params.get("category")) ? params.get("category") : "all";

  const services = useMemo(
    () => (category === "all" ? content.services : content.services.filter((s) => s.category === category)),
    [category, content.services],
  );

  const select = (cat) => setParams(cat === "all" ? {} : { category: cat }, { replace: true });

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/services" />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.treatments") }]} />

      <section className="section">
        <div className="container">
          <div className="filter-bar" role="toolbar" aria-label={t("services.filterLabel")}>
            {["all", ...SERVICE_CATEGORIES].map((cat) => (
              <Chip key={cat} active={category === cat} onClick={() => select(cat)}>
                {t(`categories.${cat}`)}
              </Chip>
            ))}
          </div>
          <motion.div className="grid grid--services" layout>
            <AnimatePresence mode="popLayout">
              {services.map((service) => (
                <motion.div
                  key={service.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHeader title={copy.compare.title} subtitle={copy.compare.subtitle} />
          <Reveal className="table-wrap glass">
            <table className="compare-table">
              <thead>
                <tr>
                  {copy.compare.headers.map((h, i) => (
                    <th key={i} scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {copy.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <JourneySection />
      <CtaBanner />
    </>
  );
}
