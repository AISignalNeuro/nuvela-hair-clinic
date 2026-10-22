import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Seo from "../../components/ui/Seo.jsx";
import PageHero from "../../components/ui/PageHero.jsx";
import Icon from "../../components/ui/Icon.jsx";
import CtaBanner from "../../components/ui/CtaBanner.jsx";
import { Chip, EmptyState } from "../../components/ui/Primitives.jsx";
import BlogCard from "../../components/blog/BlogCard.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { BLOG_CATEGORIES } from "../../content/shared/catalog.js";

export default function BlogListPage() {
  const { t, content } = useI18n();
  const copy = content.pages.blogPage;
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const category = BLOG_CATEGORIES.includes(params.get("category")) ? params.get("category") : "all";

  const posts = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return content.posts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      return !q || `${post.title} ${post.excerpt}`.toLocaleLowerCase().includes(q);
    });
  }, [content.posts, category, query]);

  const showFeatured = category === "all" && !query;
  const [featured, ...rest] = posts;
  const grid = showFeatured ? rest : posts;

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDescription} path="/blog" />
      <PageHero eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} crumbs={[{ label: t("nav.blog") }]} />

      <section className="section">
        <div className="container">
          <div className="gallery-toolbar">
            <div className="filter-bar">
              {["all", ...BLOG_CATEGORIES].map((cat) => (
                <Chip key={cat} active={category === cat} onClick={() => setParams(cat === "all" ? {} : { category: cat }, { replace: true })}>
                  {t(`blog.categories.${cat}`)}
                </Chip>
              ))}
            </div>
            <label className="search-field">
              <Icon name="search" size={18} />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("blog.searchPlaceholder")} aria-label={t("blog.searchPlaceholder")} />
            </label>
          </div>

          {posts.length === 0 ? (
            <EmptyState>{t("blog.empty")}</EmptyState>
          ) : (
            <>
              {showFeatured && featured && (
                <div className="featured-post">
                  <span className="badge badge-gold">{t("blog.featured")}</span>
                  <BlogCard post={featured} featured />
                </div>
              )}
              <motion.div className="grid grid--3" layout>
                <AnimatePresence mode="popLayout">
                  {grid.map((post) => (
                    <motion.div key={post.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}>
                      <BlogCard post={post} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
      <CtaBanner title={t("blog.ctaTitle")} text={t("blog.ctaText")} />
    </>
  );
}
