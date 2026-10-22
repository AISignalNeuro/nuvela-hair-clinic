import { mkdirSync } from "node:fs";
import { extname, resolve } from "node:path";
import multer from "multer";
import { env } from "../../../config/env.js";
import { HttpException } from "../../../core/httpException.js";
import { randomToken } from "../../../utils/crypto.js";

export const uploadDir = resolve(process.cwd(), env.uploads.dir);
mkdirSync(uploadDir, { recursive: true });

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${randomToken(6)}${ALLOWED.get(file.mimetype) ?? extname(file.originalname)}`),
});

export const imageUpload = multer({
  storage,
  limits: { fileSize: env.uploads.maxSizeMb * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) =>
    ALLOWED.has(file.mimetype) ? cb(null, true) : cb(HttpException.badRequest("Only JPEG, PNG, WebP or AVIF images are allowed")),
});
