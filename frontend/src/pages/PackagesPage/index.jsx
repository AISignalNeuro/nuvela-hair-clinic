import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import Accordion, { faqSchema } from "../../components/ui/Accordion.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import { Reveal, SectionHeader } from "../../components/ui/Primitives.jsx";
import PackageCard from "../../components/packages/PackageCard.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { PACKAGE_FEATURE_ROWS } from "../../content/shared/catalog.js";

export default function PackagesPage() {
  const { t, content } = useI18n();
  const copy = content.pages.packagesPage;
  const pricingFaqs = content.faqs.filter((f) => f.category === "pricing" || f.category === "travel").map((f) => ({ ...f }));

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/packages" jsonLd={faqSchema(pricingFaqs)} />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.packages") }]} />

      <section className="section section--overlap">
        <div className="container grid grid--3 packages-grid">
          {content.packages.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i * 0.08}>
              <PackageCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
        <p className="container fine-print">
          <Icon name="info" size={14} /> {t("common.priceNote")}
        </p>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHeader title={t("packages.compareTitle")} />
          <Reveal className="table-wrap glass">
            <table className="compare-table compare-table--packages">
              <thead>
                <tr>
                  <th scope="col">{t("packages.feature")}</th>
                  {content.packages.map((pkg) => (
                    <th key={pkg.slug} scope="col" className={pkg.popular ? "is-popular" : ""}>
                      {t(`packages.names.${pkg.slug}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PACKAGE_FEATURE_ROWS.map((row) => (
                  <tr key={row.features[0]}>
                    <th scope="row">{row.label ? t(`packages.rows.${row.label}`) : t(`packages.features.${row.features[0]}`)}</th>
                    {content.packages.map((pkg) => {
                      const match = row.features.find((key) => pkg.includes.includes(key));
                      return (
                        <td key={pkg.slug} className={pkg.popular ? "is-popular" : ""}>
                          {match ? (
                            row.label ? (
                              <span className="cell-value">{t(`packages.features.${match}`)}</span>
                            ) : (
                              <Icon name="check" size={18} className="cell-yes" title={t("common.included")} />
                            )
                          ) : (
                            <Icon name="minus" size={18} className="cell-no" title={t("common.notIncluded")} />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader title={copy.factorsTitle} />
          <div className="grid grid--4">
            {copy.factors.map((f, i) => (
              <Reveal key={f.title} className="feature-card" delay={i * 0.06}>
                <span className="feature-icon">
                  <Icon name={f.icon} size={24} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="not-included">
            <h3>{copy.notIncludedTitle}</h3>
            <ul>
              {copy.notIncluded.map((item) => (
                <li key={item}>
                  <Icon name="minus" size={16} /> {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container narrow">
          <SectionHeader title={t("services.detail.faqTitle")} />
          <Accordion items={pricingFaqs} />
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
