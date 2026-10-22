// Seeds the database from the frontend content files, so the website and the API
// always start from the same source. Safe to run repeatedly (upserts by slug).
//
//   npm run db:seed
//
// Set SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD to create a staff admin account.
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SITE } from "../../frontend/src/content/shared/site.js";
import { SERVICES } from "../../frontend/src/content/shared/services.js";
import { CASES, DOCTORS, PACKAGES, POSTS, TESTIMONIALS } from "../../frontend/src/content/shared/catalog.js";
import en from "../../frontend/src/locales/en/index.js";
import tr from "../../frontend/src/locales/tr/index.js";
import ar from "../../frontend/src/locales/ar/index.js";

const prisma = new PrismaClient();
const LOCALES = { en, tr, ar };

const translations = (pick) =>
  Object.entries(LOCALES)
    .map(([locale, bundle]) => {
      const copy = pick(bundle);
      return copy ? { locale, ...copy } : null;
    })
    .filter(Boolean);

async function seedServices() {
  for (const [index, s] of SERVICES.entries()) {
    const data = {
      category: s.category,
      icon: s.icon,
      art: s.art,
      sortOrder: index,
      isFeatured: Boolean(s.featured),
      isPopular: Boolean(s.popular),
      priceFrom: s.priceFrom,
      priceUnit: s.priceUnit ?? null,
      facts: s.facts,
    };
    const service = await prisma.service.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
    for (const t of translations((b) => b.services[s.slug])) {
      const copy = {
        title: t.title,
        shortTitle: t.shortTitle,
        tagline: t.tagline,
        summary: t.summary,
        intro: t.intro,
        sections: t.sections,
        benefits: t.benefits,
        candidates: t.candidates,
        steps: t.steps,
        faqs: t.faqs,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      };
      await prisma.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId: service.id, locale: t.locale } },
        update: copy,
        create: { serviceId: service.id, locale: t.locale, ...copy },
      });
    }
  }
}

async function seedCases() {
  const services = Object.fromEntries((await prisma.service.findMany({ select: { id: true, slug: true } })).map((s) => [s.slug, s.id]));
  for (const [index, c] of CASES.entries()) {
    const data = {
      serviceId: services[c.service],
      art: c.art,
      grafts: c.grafts,
      age: c.age,
      gender: c.gender,
      country: c.country,
      monthsAfter: c.months,
      severity: c.severity,
      seed: c.seed,
      isFeatured: Boolean(c.featured),
      sortOrder: index,
    };
    const item = await prisma.galleryCase.upsert({ where: { slug: c.slug }, update: data, create: { slug: c.slug, ...data } });
    for (const t of translations((b) => b.cases[c.slug])) {
      await prisma.galleryCaseTranslation.upsert({
        where: { caseId_locale: { caseId: item.id, locale: t.locale } },
        update: { highlight: t.highlight, tags: t.tags },
        create: { caseId: item.id, locale: t.locale, highlight: t.highlight, tags: t.tags },
      });
    }
  }
}

async function seedTeam() {
  for (const [index, d] of DOCTORS.entries()) {
    const data = { name: d.name, initials: d.initials, years: d.years, languages: d.languages, hue: d.hue, sortOrder: index };
    const member = await prisma.teamMember.upsert({ where: { slug: d.slug }, update: data, create: { slug: d.slug, ...data } });
    for (const t of translations((b) => b.doctors[d.slug])) {
      const copy = { role: t.role, bio: t.bio, specialties: t.specialties };
      await prisma.teamMemberTranslation.upsert({
        where: { memberId_locale: { memberId: member.id, locale: t.locale } },
        update: copy,
        create: { memberId: member.id, locale: t.locale, ...copy },
      });
    }
  }
}

async function seedPosts() {
  const authors = Object.fromEntries((await prisma.teamMember.findMany({ select: { id: true, slug: true } })).map((m) => [m.slug, m.id]));
  for (const p of POSTS) {
    const data = {
      category: p.category,
      theme: p.theme,
      icon: p.icon,
      readTime: p.readTime,
      isFeatured: Boolean(p.featured),
      publishedAt: new Date(p.publishedAt),
      authorId: authors[p.author] ?? null,
    };
    const post = await prisma.blogPost.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
    for (const t of translations((b) => b.blog[p.slug])) {
      const copy = { title: t.title, excerpt: t.excerpt, sections: t.sections, faqs: t.faqs ?? null };
      await prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId: post.id, locale: t.locale } },
        update: copy,
        create: { postId: post.id, locale: t.locale, ...copy },
      });
    }
  }
}

async function seedPackages() {
  for (const [index, p] of PACKAGES.entries()) {
    const data = { priceFrom: p.priceFrom, technique: p.technique, includes: p.includes, isPopular: p.popular, sortOrder: index };
    const pkg = await prisma.package.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
    for (const t of translations((b) => ({ name: b.ui.packages.names[p.slug], tagline: b.ui.packages.taglines[p.slug] }))) {
      await prisma.packageTranslation.upsert({
        where: { packageId_locale: { packageId: pkg.id, locale: t.locale } },
        update: { name: t.name, tagline: t.tagline },
        create: { packageId: pkg.id, locale: t.locale, name: t.name, tagline: t.tagline },
      });
    }
  }
}

// FAQ and testimonial rows are per locale, so they are replaced wholesale.
async function seedFaqsAndTestimonials() {
  await prisma.faq.deleteMany();
  await prisma.testimonial.deleteMany();
  for (const [locale, bundle] of Object.entries(LOCALES)) {
    await prisma.faq.createMany({
      data: bundle.faqs.map((f, i) => ({ locale, category: f.category, question: f.q, answer: f.a, sortOrder: i })),
    });
    await prisma.testimonial.createMany({
      data: TESTIMONIALS.map((t, i) => ({
        locale,
        patientName: t.name,
        country: t.country,
        rating: t.rating,
        serviceSlug: t.service,
        content: bundle.testimonials[t.id],
        sortOrder: i,
      })),
    });
  }
}

async function seedSettings() {
  await prisma.siteSetting.upsert({ where: { id: 1 }, update: { data: SITE }, create: { id: 1, data: SITE } });
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) return console.log("  • admin skipped (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set)");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { role: "ADMIN", passwordHash, isActive: true },
    create: { email: email.toLowerCase(), fullName: "Clinic Admin", role: "ADMIN", provider: "PASSWORD", passwordHash },
  });
  console.log(`  • admin account ready: ${email}`);
}

async function main() {
  console.log("Seeding Nuvela database…");
  await seedServices();
  await seedCases();
  await seedTeam();
  await seedPosts();
  await seedPackages();
  await seedFaqsAndTestimonials();
  await seedSettings();
  await seedAdmin();
  const counts = await Promise.all([prisma.service.count(), prisma.galleryCase.count(), prisma.blogPost.count(), prisma.faq.count()]);
  console.log(`Done: ${counts[0]} services, ${counts[1]} cases, ${counts[2]} posts, ${counts[3]} FAQ rows.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
