import { env } from "./env.js";

export const corsOptions = {
  origin(origin, callback) {
    // Same-origin requests and tools like curl send no Origin header.
    if (!origin || env.corsOrigins.includes(origin) || env.corsOrigins.includes("*")) return callback(null, true);
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
  maxAge: 600,
};

export const helmetOptions = {
  crossOriginResourcePolicy: { policy: "cross-origin" },
};
