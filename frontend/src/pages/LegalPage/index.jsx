import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";

export default function LegalPage({ doc }) {
  const { content } = useI18n();
  const page = content.pages.legal[doc];

  return (
    <>
      <Seo title={page.seoTitle} path={`/${doc}`} />
      <PageHero title={page.title} subtitle={page.updated} crumbs={[{ label: page.title }]} />
      <section className="section">
        <div className="container narrow prose">
          {page.sections.map((section) => (
            <section key={section.heading} className="prose-section">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
