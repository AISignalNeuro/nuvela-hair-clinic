import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import { Chip, EmptyState } from "../../components/ui/Primitives.jsx";
import CaseCard from "../../components/gallery/CaseCard.jsx";
import CaseModal from "../../components/gallery/CaseModal.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { SERVICE_CATEGORIES } from "../../content/shared/services.js";

const GALLERY_CATEGORIES = SERVICE_CATEGORIES.filter((c) => c !== "treatment");

export default function GalleryPage() {
  const { t, content, format } = useI18n();
  const copy = content.pages.galleryPage;
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const category = GALLERY_CATEGORIES.includes(params.get("category")) ? params.get("category") : "all";
  const activeSlug = params.get("case");
  const activeCase = content.cases.find((c) => c.slug === activeSlug) ?? null;

  const updateParams = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const cases = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return content.cases.filter((item) => {
      if (category !== "all" && item.serviceData?.category !== category) return false;
      if (!q) return true;
      const haystack = [item.serviceData?.title, item.highlight, String(item.grafts), format.country(item.country), ...(item.tags ?? [])]
        .join(" ")
        .toLocaleLowerCase();
      return haystack.includes(q);
    });
  }, [content.cases, category, query, format]);

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/gallery" />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.results") }]} />

      <section className="section">
        <div className="container">
          <div className="gallery-toolbar">
            <div className="filter-bar">
              {["all", ...GALLERY_CATEGORIES].map((cat) => (
                <Chip key={cat} active={category === cat} onClick={() => updateParams({ category: cat === "all" ? "" : cat })}>
                  {t(`categories.${cat}`)}
                </Chip>
              ))}
            </div>
            <label className="search-field">
              <Icon name="search" size={18} />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("gallery.searchPlaceholder")} aria-label={t("gallery.searchPlaceholder")} />
            </label>
          </div>
          <p className="result-count">
            {t("gallery.showing", { count: cases.length })} · <Icon name="info" size={14} /> {t("gallery.illustrative")}
          </p>

          {cases.length === 0 ? (
            <EmptyState>{t("gallery.empty")}</EmptyState>
          ) : (
            <motion.div className="grid grid--3" layout>
              <AnimatePresence mode="popLayout">
                {cases.map((item) => (
                  <motion.div key={item.slug} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <CaseCard item={item} onOpen={(c) => updateParams({ case: c.slug })} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          <p className="fine-print">
            <Icon name="shield" size={14} /> {t("gallery.illustrativeNote")}
          </p>
        </div>
      </section>

      <CaseModal item={activeCase} onClose={() => updateParams({ case: "" })} />
      <CtaBanner />
    </>
  );
}
