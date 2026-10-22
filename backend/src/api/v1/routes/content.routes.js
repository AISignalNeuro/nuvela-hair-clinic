// Public, read-only content endpoints. All accept ?lang=en|tr|ar (or Accept-Language).
import { Router } from "express";
import { asyncHandler as h } from "../../../core/asyncHandler.js";
import * as ctrl from "../controllers/content.controller.js";
import { validate } from "../middlewares/validate.js";
import * as v from "../validators/index.js";

const router = Router();

// Content changes rarely; let browsers and CDNs cache it briefly.
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.setHeader("Vary", "Accept-Language");
  next();
});

router.get("/services", validate(v.listServicesQuery, "query"), h(ctrl.listServices));
router.get("/services/:slug", h(ctrl.getService));

router.get("/gallery/cases", validate(v.listCasesQuery, "query"), h(ctrl.listCases));
router.get("/gallery/cases/:slug", h(ctrl.getCase));

router.get("/blog/posts", validate(v.listPostsQuery, "query"), h(ctrl.listPosts));
router.get("/blog/posts/:slug", h(ctrl.getPost));
router.get("/blog/categories", h(ctrl.listBlogCategories));

router.get("/team", h(ctrl.listTeam));
router.get("/team/:slug", h(ctrl.getTeamMember));
router.get("/faqs", validate(v.listFaqsQuery, "query"), h(ctrl.listFaqs));
router.get("/testimonials", h(ctrl.listTestimonials));
router.get("/packages", h(ctrl.listPackages));
router.get("/settings/public", h(ctrl.getSettings));

export default router;
