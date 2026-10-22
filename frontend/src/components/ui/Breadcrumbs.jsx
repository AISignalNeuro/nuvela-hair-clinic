import LocalizedLink from "./LocalizedLink.jsx";
import Icon from "./Icon.jsx";
import { useI18n } from "../../i18n/I18nProvider.jsx";
import { APP } from "../../config/app.js";

// items: [{ label, to? }]. The home crumb is added automatically.
export default function Breadcrumbs({ items, light = false }) {
  const { t } = useI18n();
  const all = [{ label: t("common.home"), to: "/" }, ...items];
  return (
    <nav className={`breadcrumbs ${light ? "breadcrumbs--light" : ""}`} aria-label="Breadcrumb">
      <ol>
        {all.map((item, i) => (
          <li key={i}>
            {item.to && i < all.length - 1 ? <LocalizedLink to={item.to}>{item.label}</LocalizedLink> : <span aria-current="page">{item.label}</span>}
            {i < all.length - 1 && <Icon name="chevronRight" size={14} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const breadcrumbSchema = (lang, items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    ...(item.to ? { item: `${APP.siteUrl}/${lang}${item.to === "/" ? "/" : item.to}` } : {}),
  })),
});
