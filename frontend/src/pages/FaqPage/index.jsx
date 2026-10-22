import { useMemo, useState } from "react";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import Accordion, { faqSchema } from "../../components/ui/Accordion.jsx";
import { Chip, EmptyState } from "../../components/ui/Primitives.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { FAQ_CATEGORIES } from "../../content/shared/catalog.js";
import { whatsappLink } from "../../utils/contact.js";

export default function FaqPage() {
  const { t, content } = useI18n();
  const { openBooking } = useUI();
  const copy = content.pages.faqPage;
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return content.faqs.filter(
      (f) => (category === "all" || f.category === category) && (!q || `${f.q} ${f.a}`.toLocaleLowerCase().includes(q)),
    );
  }, [content.faqs, category, query]);

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/faq" jsonLd={faqSchema(content.faqs)} />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.faq") }]}>
        <label className="search-field search-field--hero">
          <Icon name="search" size={20} />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("faq.searchPlaceholder")} aria-label={t("faq.searchPlaceholder")} />
        </label>
      </PageHero>

      <section className="section">
        <div className="container faq-layout">
          <aside className="faq-categories">
            {["all", ...FAQ_CATEGORIES].map((cat) => (
              <Chip key={cat} active={category === cat} onClick={() => setCategory(cat)}>
                {t(`faq.categories.${cat}`)}
              </Chip>
            ))}
          </aside>
          <div>
            {items.length ? <Accordion key={`${category}-${query}`} items={items} /> : <EmptyState>{t("faq.empty")}</EmptyState>}
            <div className="still-card">
              <span className="still-card-icon">
                <Icon name="headset" size={26} />
              </span>
              <div>
                <h2>{t("faq.stillTitle")}</h2>
                <p>{t("faq.stillText")}</p>
              </div>
              <div className="still-card-actions">
                <a className="btn btn-whatsapp" href={whatsappLink()} target="_blank" rel="noreferrer">
                  <Icon name="whatsapp" size={18} /> {t("common.whatsapp")}
                </a>
                <button type="button" className="btn btn-ghost" onClick={() => openBooking()}>
                  {t("common.freeConsultation")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
