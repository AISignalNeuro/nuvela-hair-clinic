import { Router } from "express";
import { asyncHandler as h } from "../../../core/asyncHandler.js";
import * as ctrl from "../controllers/booking.controller.js";
import { optionalAuth, requireAuth } from "../middlewares/authGuard.js";
import { formLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import * as v from "../validators/index.js";

const router = Router();

router.post("/appointments", formLimiter, optionalAuth, validate(v.createAppointmentSchema), h(ctrl.createAppointment));
router.get("/appointments/my", requireAuth, h(ctrl.listMyAppointments));
router.post("/contact", formLimiter, validate(v.createLeadSchema), h(ctrl.createLead));

export default router;
