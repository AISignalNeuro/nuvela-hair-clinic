import rateLimit from "express-rate-limit";

const handler = (req, res) => res.status(429).json({ status: "error", message: "Too many requests, please try again later" });

export const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false, handler });

// Stricter limits for endpoints that send SMS or accept public form submissions.
export const otpLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 5, standardHeaders: "draft-7", legacyHeaders: false, handler });
export const formLimiter = rateLimit({ windowMs: 10 * 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false, handler });
