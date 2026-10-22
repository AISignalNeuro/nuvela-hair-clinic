import { z } from "zod";

const locale = z.enum(["en", "tr", "ar"]);
const phone = z.string().trim().min(7).max(24);
const optionalText = (max) => z.string().trim().max(max).optional().or(z.literal("").transform(() => undefined));
const boolish = z.enum(["true", "false"]).transform((v) => v === "true");

// --- Auth -------------------------------------------------------------------
export const requestOtpSchema = z.object({ phone });
export const verifyOtpSchema = z.object({ phone, code: z.string().regex(/^\d{6}$/, "Code must be 6 digits") });
export const googleSchema = z.object({ idToken: z.string().min(20) });
export const passwordLoginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128) });
export const refreshSchema = z.object({ refreshToken: z.string().min(20) });
export const updateMeSchema = z.object({
  fullName: z.string().trim().min(2).max(120).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  locale: locale.optional(),
});

// --- Public content queries -------------------------------------------------
export const listServicesQuery = z.object({
  category: z.enum(["hair", "women", "facial", "treatment"]).optional(),
  featured: boolish.optional(),
});

export const listCasesQuery = z.object({
  category: z.enum(["hair", "women", "facial"]).optional(),
  service: z.string().max(80).optional(),
  featured: boolish.optional(),
  q: z.string().max(80).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const listPostsQuery = z.object({
  category: z.string().max(40).optional(),
  q: z.string().max(80).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export const listFaqsQuery = z.object({ category: z.string().max(40).optional() });

// --- Bookings & contact -----------------------------------------------------
export const createAppointmentSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone,
  email: z.string().trim().toLowerCase().email().optional(),
  country: z.string().trim().length(2).toUpperCase().optional(),
  serviceSlug: z.string().max(80).optional(),
  contactChannel: z.enum(["whatsapp", "phone", "email"]).default("whatsapp"),
  preferredDate: z.coerce.date().optional(),
  companions: z.number().int().min(0).max(5).optional(),
  airport: z.enum(["IST", "SAW", "unknown"]).optional(),
  concern: z.string().max(40).optional(),
  hairLossDuration: z.string().max(20).optional(),
  previousTransplant: z.boolean().optional(),
  note: optionalText(2000),
  source: z.string().max(40).optional(),
  locale: locale.default("en"),
});

export const createLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  phone: phone.optional(),
  subject: z.enum(["consultation", "pricing", "travel", "other"]).default("other"),
  message: z.string().trim().min(5).max(4000),
  locale: locale.default("en"),
});

// --- Admin ------------------------------------------------------------------
export const adminListQuery = z.object({
  status: z.string().max(20).optional(),
  q: z.string().max(80).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const updateAppointmentSchema = z
  .object({
    status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"]).optional(),
    adminNote: z.string().max(4000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");

export const updateLeadSchema = z.object({ status: z.enum(["NEW", "CONTACTED", "CLOSED"]) });

export const updateUserSchema = z
  .object({
    role: z.enum(["ADMIN", "EDITOR", "DOCTOR", "RECEPTIONIST", "PATIENT"]).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to update");

export const faqSchema = z.object({
  locale,
  category: z.enum(["general", "procedure", "travel", "aftercare", "pricing"]),
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(4000),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  locale,
  patientName: z.string().trim().min(2).max(80),
  country: z.string().trim().length(2).toUpperCase().optional(),
  rating: z.number().int().min(1).max(5).default(5),
  serviceSlug: z.string().max(80).optional(),
  content: z.string().trim().min(10).max(2000),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

const section = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  heading: z.string().min(2).max(200),
  paragraphs: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)).optional(),
});

export const blogPostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(120),
  category: z.enum(["costs", "techniques", "aftercare", "travel", "guides"]),
  theme: z.string().max(20).default("turquoise"),
  icon: z.string().max(20).default("sparkle"),
  readTime: z.number().int().min(1).max(60).default(5),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  publishedAt: z.coerce.date(),
  authorSlug: z.string().max(80).optional(),
  translations: z
    .array(
      z.object({
        locale,
        title: z.string().min(5).max(200),
        excerpt: z.string().min(10).max(500),
        sections: z.array(section).min(1),
        faqs: z.array(z.object({ q: z.string().min(3), a: z.string().min(3) })).optional(),
        metaTitle: z.string().max(200).optional(),
        metaDescription: z.string().max(320).optional(),
      }),
    )
    .min(1)
    .refine((list) => list.some((t) => t.locale === "en"), "An English translation is required"),
});
