import { ok } from "../../../core/apiResponse.js";
import * as content from "../services/content.service.js";

const q = (req) => req.validatedQuery ?? {};

export const listServices = async (req, res) => ok(res, await content.listServices(req.locale, q(req)));
export const getService = async (req, res) => ok(res, await content.getService(req.locale, req.params.slug));

export const listCases = async (req, res) => {
  const { items, meta } = await content.listCases(req.locale, q(req));
  ok(res, items, meta);
};
export const getCase = async (req, res) => ok(res, await content.getCase(req.locale, req.params.slug));

export const listPosts = async (req, res) => {
  const { items, meta } = await content.listPosts(req.locale, q(req));
  ok(res, items, meta);
};
export const getPost = async (req, res) => ok(res, await content.getPost(req.locale, req.params.slug));
export const listBlogCategories = async (req, res) => ok(res, await content.listBlogCategories());

export const listTeam = async (req, res) => ok(res, await content.listTeam(req.locale));
export const getTeamMember = async (req, res) => ok(res, await content.getTeamMember(req.locale, req.params.slug));
export const listFaqs = async (req, res) => ok(res, await content.listFaqs(req.locale, q(req)));
export const listTestimonials = async (req, res) => ok(res, await content.listTestimonials(req.locale));
export const listPackages = async (req, res) => ok(res, await content.listPackages(req.locale));
export const getSettings = async (req, res) => ok(res, await content.getPublicSettings());
