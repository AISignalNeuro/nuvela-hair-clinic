import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "../../components/ui/Seo.jsx";
import Icon from "../../components/ui/Icon.jsx";
import ArtCover from "../../components/ui/ArtCover.jsx";
import Accordion, { faqSchema } from "../../components/ui/Accordion.jsx";
import Breadcrumbs, { breadcrumbSchema } from "../../components/ui/Breadcrumbs.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import { Avatar, SectionHeader } from "../../components/ui/Primitives.jsx";
import BlogCard from "../../components/blog/BlogCard.jsx";
import NotFoundPage from "../NotFoundPage/index.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { useUI } from "../../context/UIContext.jsx";
import { useReadingProgress, useScrollSpy } from "../../hooks/index.js";
import { articleSchema } from "../../utils/schema.js";
import { EASE } from "../../config/motion.js";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { content } = useI18n();
  const post = content.posts.find((p) => p.slug === slug);
  if (!post) return <NotFoundPage />;
  return <Article key={slug} post={post} />;
}

function Article({ post }) {
  const { t, lang, content, format } = useI18n();
  const { openBooking, toast } = useUI();
  const progress = useReadingProgress();
  const activeId = useScrollSpy(post.sections.map((s) => s.id));
  const related = content.posts.filter((p) => p.slug !== post.slug).sort((a, b) => (b.category === post.category) - (a.category === post.category)).slice(0, 3);
  const faqItems = (post.faqs ?? []).map((f, i) => ({ id: `bfaq-${i}`, ...f }));
  const crumbs = [
    { label: t("nav.blog"), to: "/blog" },
    { label: post.title, to: `/blog/${post.slug}` },
  ];
  const author = post.authorData;
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: post.title, text: post.excerpt, url: pageUrl });
      else {
        await navigator.clipboard.writeText(pageUrl);
        toast(t("common.linkCopied"));
      }
    } catch {
      // User cancelled the native share sheet.
    }
  };

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        type="article"
        jsonLd={[articleSchema(lang, post), faqItems.length ? faqSchema(faqItems) : null, breadcrumbSchema(lang, [{ label: t("common.home"), to: "/" }, ...crumbs])]}
      />
      <div className="reading-progress" style={{ transform: `scaleX(${progress})` }} role="progressbar" aria-label={t("blog.progress")} aria-valuenow={Math.round(progress * 100)} />

      <header className="article-hero">
        <div className="container article-hero-inner">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}>
            <Breadcrumbs items={crumbs} />
            <span className="eyebrow">{t(`blog.categories.${post.category}`)}</span>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-excerpt">{post.excerpt}</p>
            <div className="article-meta">
              {author && (
                <span className="article-author">
                  <Avatar initials={author.initials} hue={author.hue} size={36} />
                  <span>
                    {t("blog.by")} <strong>{author.name}</strong>
                  </span>
                </span>
              )}
              <span>
                <Icon name="calendar" size={15} /> {format.date(post.publishedAt)}
              </span>
              <span>
                <Icon name="clock" size={15} /> {t("common.minRead", { n: post.readTime })}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={share}>
                <Icon name="share" size={15} /> {t("common.share")}
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.1, ease: EASE } }}>
            <ArtCover theme={post.theme} icon={post.icon} className="article-cover" />
          </motion.div>
        </div>
      </header>

      <section className="section section--tight">
        <div className="container detail-layout detail-layout--article">
          <aside className="detail-toc">
            <div className="toc-card">
              <p className="toc-title">{t("blog.toc")}</p>
              <ol>
                {post.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={activeId === s.id ? "is-active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article className="detail-content prose">
            {post.sections.map((section, i) => (
              <section key={section.id} id={section.id} className="prose-section">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {section.bullets && (
                  <ul className="check-list">
                    {section.bullets.map((b) => (
                      <li key={b}>
                        <Icon name="check" size={16} /> {b}
                      </li>
                    ))}
                  </ul>
                )}
                {i === 1 && (
                  <aside className="inline-cta">
                    <span className="inline-cta-icon">
                      <Icon name="camera" size={22} />
                    </span>
                    <div>
                      <strong>{t("blog.ctaTitle")}</strong>
                      <p>{t("blog.ctaText")}</p>
                    </div>
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => openBooking()}>
                      {t("common.freeConsultation")}
                    </button>
                  </aside>
                )}
              </section>
            ))}

            {faqItems.length > 0 && (
              <section className="prose-section" id="article-faq">
                <h2>{t("blog.faqTitle")}</h2>
                <Accordion items={faqItems} />
              </section>
            )}

            {author && (
              <div className="author-card">
                <Avatar initials={author.initials} hue={author.hue} size={64} />
                <div>
                  <p className="author-card-label">{t("blog.authorTitle")}</p>
                  <h3>{author.name}</h3>
                  <p className="author-card-role">{author.role}</p>
                  <p>{author.bio}</p>
                </div>
              </div>
            )}

            <div className="share-row">
              <span>{t("blog.shareTitle")}</span>
              <a className="social-btn social-btn--dark" href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${pageUrl}`)}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <Icon name="whatsapp" size={18} />
              </a>
              <a className="social-btn social-btn--dark" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Icon name="facebook" size={18} />
              </a>
              <button
                type="button"
                className="social-btn social-btn--dark"
                aria-label={t("common.copyLink")}
                onClick={() => navigator.clipboard?.writeText(pageUrl).then(() => toast(t("common.linkCopied")))}
              >
                <Icon name="link" size={18} />
              </button>
            </div>
          </article>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHeader title={t("blog.related")} />
          <div className="grid grid--3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>
      <CtaBanner title={t("blog.ctaTitle")} text={t("blog.ctaText")} />
    </>
  );
}
