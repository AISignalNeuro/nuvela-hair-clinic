// schema.org builders for structured data (MedicalClinic, MedicalProcedure, Article).
import { APP } from "../config/app.js";
import { SITE } from "../content/shared/site.js";

export const clinicSchema = (lang, description) => ({
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: SITE.name,
  description,
  url: `${APP.siteUrl}/${lang}/`,
  telephone: SITE.phone,
  email: SITE.email,
  image: `${APP.siteUrl}/og-image.png`,
  priceRange: "€€",
  medicalSpecialty: ["Dermatology", "PlasticSurgery"],
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.district,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  ],
  aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.stats.rating, reviewCount: SITE.stats.reviews },
});

export const procedureSchema = (lang, service) => ({
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: service.title,
  description: service.metaDescription,
  url: `${APP.siteUrl}/${lang}/services/${service.slug}`,
  procedureType: service.category === "treatment" ? "NoninvasiveProcedure" : "SurgicalProcedure",
  howPerformed: service.intro,
  offers: { "@type": "Offer", price: service.priceFrom, priceCurrency: SITE.currency },
});

export const articleSchema = (lang, post) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.publishedAt,
  dateModified: post.publishedAt,
  inLanguage: lang,
  mainEntityOfPage: `${APP.siteUrl}/${lang}/blog/${post.slug}`,
  image: `${APP.siteUrl}/og-image.png`,
  author: { "@type": "Person", name: post.authorData?.name ?? SITE.name },
  publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${APP.siteUrl}/favicon.svg` } },
});
