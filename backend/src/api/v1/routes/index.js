import { Router } from "express";
import { prisma } from "../../../config/db.js";
import { env } from "../../../config/env.js";
import { resolveLocale } from "../middlewares/locale.js";
import authRoutes from "./auth.routes.js";
import contentRoutes from "./content.routes.js";
import bookingRoutes from "./booking.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.get("/health", async (req, res) => {
  let database = "ok";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    database = "unavailable";
  }
  res.status(database === "ok" ? 200 : 503).json({ status: database === "ok" ? "ok" : "degraded", env: env.nodeEnv, database, time: new Date().toISOString() });
});

router.use(resolveLocale);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use(bookingRoutes);
router.use(contentRoutes);

export default router;
