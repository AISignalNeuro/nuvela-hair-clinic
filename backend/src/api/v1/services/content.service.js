import { prisma } from "../../../config/db.js";
import { HttpException } from "../../../core/httpException.js";
import { localize, translationsFor } from "../../../utils/i18n.js";
import { pageMeta, paginate } from "../../../utils/pagination.js";

const withTranslations = (locale) => ({ translations: translationsFor(locale) });

// --- Services -----------------------------------------------------------------
export async function listServices(locale, { category, featured } = {}) {
  const services = await prisma.service.findMany({
    where: { isActive: true, ...(category ? { category } : {}), ...(featured !== undefined ? { isFeatured: featured } : {}) },
    orderBy: { sortOrder: "asc" },
    include: withTranslations(locale),
  });
  return services.map((s) => {
    const { intro, sections, benefits, candidates, steps, faqs, ...card } = localize(s, locale);
    return card;
  });
}

export async function getService(locale, slug) {
  const service = await prisma.service.findFirst({
    where: { slug, isActive: true },
    include: {
      ...withTranslations(locale),
      cases: { where: { isPublished: true }, orderBy: { sortOrder: "asc" }, take: 3, include: withTranslations(locale) },
    },
  });
  if (!service) throw HttpException.notFound("Service not found");
  const localized = localize(service, locale);
  return { ...localized, cases: service.cases.map((c) => localize(c, locale)) };
}

// --- Gallery ------------------------------------------------------------------
export async function listCases(locale, query) {
  const paging = paginate(query, { defaultLimit: 12 });
  const where = {
    isPublished: true,
    ...(query.featured !== undefined ? { isFeatured: query.featured } : {}),
    ...(query.service || query.category
      ? { service: { ...(query.service ? { slug: query.service } : {}), ...(query.category ? { category: query.category } : {}) } }
      : {}),
    ...(query.q
      ? { translations: { some: { locale, OR: [{ highlight: { contains: query.q, mode: "insensitive" } }, { tags: { has: query.q } }] } } }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.galleryCase.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: paging.skip,
      take: paging.take,
      include: { ...withTranslations(locale), service: { select: { slug: true, category: true, icon: true } } },
    }),
    prisma.galleryCase.count({ where }),
  ]);
  return { items: items.map((c) => localize(c, locale)), meta: pageMeta(paging, total) };
}

export async function getCase(locale, slug) {
  const item = await prisma.galleryCase.findFirst({
    where: { slug, isPublished: true },
    include: { ...withTranslations(locale), service: { include: withTranslations(locale) } },
  });
  if (!item) throw HttpException.notFound("Case not found");
  return { ...localize(item, locale), service: localize(item.service, locale) };
}

// --- Journal ------------------------------------------------------------------
const authorInclude = (locale) => ({ author: { include: withTranslations(locale) } });

export async function listPosts(locale, query) {
  const paging = paginate(query, { defaultLimit: 9 });
  const where = {
    isPublished: true,
    publishedAt: { lte: new Date() },
    ...(query.category ? { category: query.category } : {}),
    ...(query.q
      ? { translations: { some: { locale, OR: [{ title: { contains: query.q, mode: "insensitive" } }, { excerpt: { contains: query.q, mode: "insensitive" } }] } } }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.blogPost.findMany({ where, orderBy: { publishedAt: "desc" }, skip: paging.skip, take: paging.take, include: { ...withTranslations(locale), ...authorInclude(locale) } }),
    prisma.blogPost.count({ where }),
  ]);
  return {
    items: items.map((p) => {
      const { sections, faqs, ...card } = localize(p, locale);
      return { ...card, author: p.author ? localize(p.author, locale) : null };
    }),
    meta: pageMeta(paging, total),
  };
}

export async function getPost(locale, slug) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, isPublished: true },
    include: { ...withTranslations(locale), ...authorInclude(locale) },
  });
  if (!post) throw HttpException.notFound("Article not found");
  const related = await prisma.blogPost.findMany({
    where: { isPublished: true, slug: { not: slug }, category: post.category },
    orderBy: { publishedAt: "desc" },
    take: 3,
    include: withTranslations(locale),
  });
  return {
    ...localize(post, locale),
    author: post.author ? localize(post.author, locale) : null,
    related: related.map((r) => {
      const { sections, faqs, ...card } = localize(r, locale);
      return card;
    }),
  };
}

export async function listBlogCategories() {
  const groups = await prisma.blogPost.groupBy({ by: ["category"], where: { isPublished: true }, _count: { _all: true } });
  return groups.map((g) => ({ slug: g.category, count: g._count._all }));
}

// --- Team, FAQ, testimonials, packages, settings ------------------------------
export async function listTeam(locale) {
  const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, include: withTranslations(locale) });
  return team.map((m) => localize(m, locale));
}

export async function getTeamMember(locale, slug) {
  const member = await prisma.teamMember.findFirst({ where: { slug, isActive: true }, include: withTranslations(locale) });
  if (!member) throw HttpException.notFound("Team member not found");
  return localize(member, locale);
}

// FAQ and testimonials are stored per locale; fall back to English if a locale has none yet.
async function perLocale(model, locale, where, orderBy) {
  const rows = await prisma[model].findMany({ where: { ...where, locale }, orderBy });
  if (rows.length || locale === "en") return rows;
  return prisma[model].findMany({ where: { ...where, locale: "en" }, orderBy });
}

export const listFaqs = (locale, { category } = {}) =>
  perLocale("faq", locale, { isActive: true, ...(category ? { category } : {}) }, [{ category: "asc" }, { sortOrder: "asc" }]);

export const listTestimonials = (locale) => perLocale("testimonial", locale, { isPublished: true }, { sortOrder: "asc" });

export async function listPackages(locale) {
  const packages = await prisma.package.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, include: withTranslations(locale) });
  return packages.map((p) => localize(p, locale));
}

export async function getPublicSettings() {
  const settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
  return settings?.data ?? {};
}
