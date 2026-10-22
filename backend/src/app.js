import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { corsOptions, helmetOptions } from "./config/security.js";
import apiV1 from "./api/v1/routes/index.js";
import { apiLimiter } from "./api/v1/middlewares/rateLimiter.js";
import { errorHandler, notFound } from "./api/v1/middlewares/errorHandler.js";
import { uploadDir } from "./api/v1/middlewares/uploadMiddleware.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  if (env.trustProxy) app.set("trust proxy", 1);

  app.use(helmet(helmetOptions));
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(express.json({ limit: "200kb" }));
  if (!env.isTest) app.use(morgan(env.isProduction ? "combined" : "dev"));

  app.get("/", (req, res) => res.json({ name: "Nuvela Hair Clinic API", version: "v1", docs: "/api/v1/health" }));
  app.use("/uploads", express.static(uploadDir, { maxAge: "30d", immutable: true }));
  app.use("/api/v1", apiLimiter, apiV1);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp();
