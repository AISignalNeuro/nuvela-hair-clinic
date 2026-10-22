import { Router } from "express";
import { asyncHandler as h } from "../../../core/asyncHandler.js";
import * as ctrl from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/authGuard.js";
import { otpLimiter } from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import * as v from "../validators/index.js";

const router = Router();

router.post("/request-otp", otpLimiter, validate(v.requestOtpSchema), h(ctrl.requestOtp));
router.post("/verify-otp", otpLimiter, validate(v.verifyOtpSchema), h(ctrl.verifyOtp));
router.post("/google", validate(v.googleSchema), h(ctrl.google));
router.post("/login", otpLimiter, validate(v.passwordLoginSchema), h(ctrl.login));
router.post("/refresh", validate(v.refreshSchema), h(ctrl.refresh));
router.post("/logout", h(ctrl.logout));
router.get("/me", requireAuth, ctrl.me);
router.patch("/me", requireAuth, validate(v.updateMeSchema), h(ctrl.updateMe));

export default router;
