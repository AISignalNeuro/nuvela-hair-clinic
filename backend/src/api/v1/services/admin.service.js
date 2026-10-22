import { prisma } from "../../../config/db.js";
import { env } from "../../../config/env.js";
import { HttpException } from "../../../core/httpException.js";
import { pageMeta, paginate } from "../../../utils/pagination.js";
import { publicUser } from "./auth.service.js";

export async function dashboardStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [appointmentsByStatus, newLeads, recentAppointments, patients, services] = await prisma.$transaction([
    prisma.appointment.groupBy({ by: ["status"], _count: { _all: true }, orderBy: { status: "asc" } }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.appointment.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.service.count({ where: { isActive: true } }),
  ]);
  return {
    appointments: Object.fromEntries(appointmentsByStatus.map((g) => [g.status, g._count._all])),
    appointmentsLast30Days: recentAppointments,
    newLeads,
    patients,
    activeServices: services,
  };
}

// --- Users --------------------------------------------------------------------
export async function listUsers(query) {
  const paging = paginate(query, { defaultLimit: 25, maxLimit: 100 });
  const where = {
    ...(query.status ? { role: query.status.toUpperCase() } : {}),
    ...(query.q ? { OR: ["fullName", "phone", "email"].map((field) => ({ [field]: { contains: query.q, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({ where, orderBy: { createdAt: "desc" }, skip: paging.skip, take: paging.take }),
    prisma.user.count({ where }),
  ]);
  return { items: items.map((u) => ({ ...publicUser(u), isActive: u.isActive, provider: u.provider })), meta: pageMeta(paging, total) };
}

export async function updateUser(actor, id, data) {
  if (actor.id === id && ((data.role && data.role !== actor.role) || data.isActive === false)) {
    throw HttpException.badRequest("You cannot change your own role or disable your own account");
  }
  const user = await prisma.user.update({ where: { id }, data });
  if (data.isActive === false) await prisma.refreshToken.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
  return { ...publicUser(user), isActive: user.isActive };
}

// --- FAQ & testimonials -------------------------------------------------------
export const createFaq = (data) => prisma.faq.create({ data });
export const updateFaq = (id, data) => prisma.faq.update({ where: { id }, data });
export const deleteFaq = (id) => prisma.faq.delete({ where: { id } });

export const createTestimonial = (data) => prisma.testimonial.create({ data });
export const updateTestimonial = (id, data) => prisma.testimonial.update({ where: { id }, data });
export const deleteTestimonial = (id) => prisma.testimonial.delete({ where: { id } });

// --- Journal ------------------------------------------------------------------
async function resolveAuthor(authorSlug) {
  if (!authorSlug) return null;
  const author = await prisma.teamMember.findUnique({ where: { slug: authorSlug }, select: { id: true } });
  if (!author) throw HttpException.badRequest("Unknown author");
  return author.id;
}

// Creates or fully replaces a post and its translations in one transaction.
export async function upsertPost({ translations, authorSlug, ...post }, existingSlug) {
  const authorId = await resolveAuthor(authorSlug);
  return prisma.$transaction(async (tx) => {
    const saved = existingSlug
      ? await tx.blogPost.update({ where: { slug: existingSlug }, data: { ...post, authorId } })
      : await tx.blogPost.create({ data: { ...post, authorId } });
    await tx.blogPostTranslation.deleteMany({ where: { postId: saved.id } });
    await tx.blogPostTranslation.createMany({ data: translations.map((t) => ({ ...t, postId: saved.id })) });
    return tx.blogPost.findUnique({ where: { id: saved.id }, include: { translations: true } });
  });
}

export const deletePost = (slug) => prisma.blogPost.delete({ where: { slug } });

// --- Media --------------------------------------------------------------------
export async function saveUpload(file, user, alt) {
  if (!file) throw HttpException.badRequest("No file uploaded");
  return prisma.media.create({
    data: {
      url: `${env.publicUrl}/uploads/${file.filename}`,
      fileName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      alt: alt || null,
      uploadedById: user.id,
    },
  });
}
