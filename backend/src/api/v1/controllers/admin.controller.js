import { created, noContent, ok } from "../../../core/apiResponse.js";
import * as admin from "../services/admin.service.js";
import * as booking from "../services/booking.service.js";

const q = (req) => req.validatedQuery ?? {};
const send = (res, { items, meta }) => ok(res, items, meta);

export const stats = async (req, res) => ok(res, await admin.dashboardStats());

export const listAppointments = async (req, res) => send(res, await booking.adminListAppointments(q(req)));
export const updateAppointment = async (req, res) => ok(res, await booking.adminUpdateAppointment(req.params.id, req.body));

export const listLeads = async (req, res) => send(res, await booking.adminListLeads(q(req)));
export const updateLead = async (req, res) => ok(res, await booking.adminUpdateLead(req.params.id, req.body));

export const listUsers = async (req, res) => send(res, await admin.listUsers(q(req)));
export const updateUser = async (req, res) => ok(res, await admin.updateUser(req.user, req.params.id, req.body));

export const createFaq = async (req, res) => created(res, await admin.createFaq(req.body));
export const updateFaq = async (req, res) => ok(res, await admin.updateFaq(req.params.id, req.body));
export const deleteFaq = async (req, res) => {
  await admin.deleteFaq(req.params.id);
  noContent(res);
};

export const createTestimonial = async (req, res) => created(res, await admin.createTestimonial(req.body));
export const updateTestimonial = async (req, res) => ok(res, await admin.updateTestimonial(req.params.id, req.body));
export const deleteTestimonial = async (req, res) => {
  await admin.deleteTestimonial(req.params.id);
  noContent(res);
};

export const createPost = async (req, res) => created(res, await admin.upsertPost(req.body));
export const updatePost = async (req, res) => ok(res, await admin.upsertPost(req.body, req.params.slug));
export const deletePost = async (req, res) => {
  await admin.deletePost(req.params.slug);
  noContent(res);
};

export const upload = async (req, res) => created(res, await admin.saveUpload(req.file, req.user, req.body?.alt));
