import { Prisma } from "@prisma/client";
import multer from "multer";
import { HttpException } from "../../../core/httpException.js";
import { env } from "../../../config/env.js";
import { logger } from "../../../utils/logger.js";

export function notFound(req, res) {
  res.status(404).json({ status: "error", message: `Route ${req.method} ${req.originalUrl} not found` });
}

export function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "Internal server error";
  let errors;

  if (err instanceof HttpException) {
    ({ status, message, errors } = err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") [status, message] = [409, "A record with these details already exists"];
    else if (err.code === "P2025") [status, message] = [404, "Resource not found"];
  } else if (err instanceof multer.MulterError) {
    [status, message] = [400, err.code === "LIMIT_FILE_SIZE" ? `File is larger than ${env.uploads.maxSizeMb} MB` : err.message];
  } else if (err?.type === "entity.parse.failed") {
    [status, message] = [400, "Request body is not valid JSON"];
  } else if (err?.type === "entity.too.large") {
    [status, message] = [413, "Request body is too large"];
  }

  if (status >= 500) logger.error(`${req.method} ${req.originalUrl}`, err);

  res.status(status).json({
    status: "error",
    message,
    ...(errors ? { errors } : {}),
    ...(!env.isProduction && status >= 500 ? { stack: err?.stack } : {}),
  });
}
