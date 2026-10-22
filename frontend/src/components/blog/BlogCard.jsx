import { motion } from "framer-motion";
import ArtCover from "../ui/ArtCover.jsx";
import Icon from "../ui/Icon.jsx";
import LocalizedLink from "../ui/LocalizedLink.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { floatCard } from "../../config/motion.js";

export default function BlogCard({ post, featured = false }) {
  const { t, format } = useI18n();
  return (
    <motion.article
      className={`blog-card ${featured ? "blog-card--featured" : ""}`}
      variants={floatCard}
      initial="rest"
      whileHover="hover"
      animate="rest"
      layout
    >
      <ArtCover theme={post.theme} icon={post.icon} label={t(`blog.categories.${post.category}`)} className="blog-card-cover" />
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span>
            <Icon name="calendar" size={14} /> {format.date(post.publishedAt)}
          </span>
          <span>
            <Icon name="clock" size={14} /> {t("common.minRead", { n: post.readTime })}
          </span>
        </div>
        <h3 className="blog-card-title">
          <LocalizedLink to={`/blog/${post.slug}`} className="stretched-link">
            {post.title}
          </LocalizedLink>
        </h3>
        <p className="blog-card-excerpt">{post.excerpt}</p>
        <span className="link-btn" aria-hidden="true">
          {t("common.readArticle")} <Icon name="arrowRight" size={16} />
        </span>
      </div>
    </motion.article>
  );
}
