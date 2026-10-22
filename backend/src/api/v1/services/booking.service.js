import { prisma } from "../../../config/db.js";
import { HttpException } from "../../../core/httpException.js";
import { makeReference } from "../../../utils/crypto.js";
import { normalizePhone } from "../../../utils/phone.js";
import { pageMeta, paginate } from "../../../utils/pagination.js";
import { logger } from "../../../utils/logger.js";

const CHANNELS = { whatsapp: "WHATSAPP", phone: "PHONE", email: "EMAIL" };

async function uniqueReference(model, prefix) {
  for (let i = 0; i < 5; i += 1) {
    const reference = makeReference(prefix);
    if (!(await prisma[model].findUnique({ where: { reference } }))) return reference;
  }
  throw new Error("Could not generate a unique reference");
}

const appointmentView = (a) => ({
  id: a.id,
  reference: a.reference,
  status: a.status,
  serviceSlug: a.service?.slug ?? null,
  fullName: a.fullName,
  phone: a.phone,
  email: a.email,
  country: a.country,
  contactChannel: a.contactChannel,
  preferredDate: a.preferredDate,
  companions: a.companions,
  airport: a.airport,
  concern: a.concern,
  hairLossDuration: a.hairLossDuration,
  previousTransplant: a.previousTransplant,
  note: a.note,
  source: a.source,
  locale: a.locale,
  createdAt: a.createdAt,
  updatedAt: a.updatedAt,
});

// --- Appointments -------------------------------------------------------------
export async function createAppointment(input, user) {
  const phone = normalizePhone(input.phone);
  if (!phone) throw HttpException.badRequest("Please enter a valid phone number");

  let serviceId = null;
  if (input.serviceSlug) {
    const service = await prisma.service.findUnique({ where: { slug: input.serviceSlug }, select: { id: true } });
    if (!service) throw HttpException.badRequest("Unknown treatment");
    serviceId = service.id;
  }

  const { serviceSlug, contactChannel, ...rest } = input;
  const appointment = await prisma.appointment.create({
    data: {
      ...rest,
      phone,
      serviceId,
      contactChannel: CHANNELS[contactChannel],
      reference: await uniqueReference("appointment", "NV"),
      userId: user?.id ?? null,
    },
    include: { service: { select: { slug: true } } },
  });
  logger.info(`[booking] new consultation request ${appointment.reference}`);
  return { id: appointment.id, reference: appointment.reference, status: appointment.status, createdAt: appointment.createdAt };
}

export async function listMyAppointments(user) {
  const where = { OR: [{ userId: user.id }, ...(user.phone ? [{ phone: user.phone }] : [])] };
  const items = await prisma.appointment.findMany({ where, orderBy: { createdAt: "desc" }, include: { service: { select: { slug: true } } } });
  return items.map(appointmentView);
}

export async function adminListAppointments(query) {
  const paging = paginate(query, { defaultLimit: 25, maxLimit: 100 });
  const where = {
    ...(query.status ? { status: query.status.toUpperCase() } : {}),
    ...(query.q
      ? { OR: ["fullName", "phone", "email", "reference"].map((field) => ({ [field]: { contains: query.q, mode: "insensitive" } })) }
      : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.appointment.findMany({ where, orderBy: { createdAt: "desc" }, skip: paging.skip, take: paging.take, include: { service: { select: { slug: true } } } }),
    prisma.appointment.count({ where }),
  ]);
  return { items: items.map((a) => ({ ...appointmentView(a), adminNote: a.adminNote })), meta: pageMeta(paging, total) };
}

export async function adminUpdateAppointment(id, data) {
  const updated = await prisma.appointment.update({ where: { id }, data, include: { service: { select: { slug: true } } } });
  return { ...appointmentView(updated), adminNote: updated.adminNote };
}

// --- Contact leads ------------------------------------------------------------
export async function createLead(input) {
  const phone = input.phone ? normalizePhone(input.phone) : null;
  const lead = await prisma.lead.create({ data: { ...input, phone, reference: await uniqueReference("lead", "MSG") } });
  logger.info(`[contact] new message ${lead.reference}`);
  return { id: lead.id, reference: lead.reference, createdAt: lead.createdAt };
}

export async function adminListLeads(query) {
  const paging = paginate(query, { defaultLimit: 25, maxLimit: 100 });
  const where = {
    ...(query.status ? { status: query.status.toUpperCase() } : {}),
    ...(query.q ? { OR: ["fullName", "email", "message", "reference"].map((field) => ({ [field]: { contains: query.q, mode: "insensitive" } })) } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: paging.skip, take: paging.take }),
    prisma.lead.count({ where }),
  ]);
  return { items, meta: pageMeta(paging, total) };
}

export const adminUpdateLead = (id, data) => prisma.lead.update({ where: { id }, data });
