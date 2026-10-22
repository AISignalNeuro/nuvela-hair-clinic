import { Router } from "express";
import { asyncHandler as h } from "../../../core/asyncHandler.js";
import * as ctrl from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/authGuard.js";
import { roleGuard } from "../middlewares/roleGuard.js";
import { imageUpload } from "../middlewares/uploadMiddleware.js";
import { validate } from "../middlewares/validate.js";
import * as v from "../validators/index.js";

const router = Router();
const staff = roleGuard("ADMIN", "EDITOR", "RECEPTIONIST", "DOCTOR");
const editors = roleGuard("ADMIN", "EDITOR");
const admins = roleGuard("ADMIN");
const list = validate(v.adminListQuery, "query");

router.use(requireAuth);

router.get("/stats", staff, h(ctrl.stats));

router.get("/appointments", staff, list, h(ctrl.listAppointments));
router.patch("/appointments/:id", staff, validate(v.updateAppointmentSchema), h(ctrl.updateAppointment));

router.get("/leads", staff, list, h(ctrl.listLeads));
router.patch("/leads/:id", staff, validate(v.updateLeadSchema), h(ctrl.updateLead));

router.get("/users", admins, list, h(ctrl.listUsers));
router.patch("/users/:id", admins, validate(v.updateUserSchema), h(ctrl.updateUser));

router.post("/faqs", editors, validate(v.faqSchema), h(ctrl.createFaq));
router.put("/faqs/:id", editors, validate(v.faqSchema), h(ctrl.updateFaq));
router.delete("/faqs/:id", editors, h(ctrl.deleteFaq));

router.post("/testimonials", editors, validate(v.testimonialSchema), h(ctrl.createTestimonial));
router.put("/testimonials/:id", editors, validate(v.testimonialSchema), h(ctrl.updateTestimonial));
router.delete("/testimonials/:id", editors, h(ctrl.deleteTestimonial));

router.post("/blog/posts", editors, validate(v.blogPostSchema), h(ctrl.createPost));
router.put("/blog/posts/:slug", editors, validate(v.blogPostSchema), h(ctrl.updatePost));
router.delete("/blog/posts/:slug", editors, h(ctrl.deletePost));

router.post("/uploads", editors, imageUpload.single("file"), h(ctrl.upload));

export default router;
