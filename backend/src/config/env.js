import dotenv from "dotenv";

dotenv.config();

const bool = (value, fallback = false) => (value === undefined ? fallback : ["1", "true", "yes"].includes(String(value).toLowerCase()));
const list = (value, fallback = []) => (value ? value.split(",").map((s) => s.trim()).filter(Boolean) : fallback);

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

export const env = {
  nodeEnv,
  isProduction,
  isTest: nodeEnv === "test",
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL,
  corsOrigins: list(process.env.CORS_ORIGINS, ["http://localhost:5173", "http://localhost:4173"]),
  trustProxy: bool(process.env.TRUST_PROXY, false),
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${Number(process.env.PORT) || 4000}`).replace(/\/+$/, ""),

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret-change-me",
    accessTtl: process.env.JWT_ACCESS_TTL || "15m",
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS) || 30,
  },

  otp: {
    secret: process.env.OTP_SECRET || "dev-otp-secret-change-me",
    ttlMinutes: Number(process.env.OTP_TTL_MINUTES) || 5,
    maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
    // In development the code is returned in the API response so the flow can be tested without SMS.
    exposeInResponse: bool(process.env.OTP_DEV_ECHO, !isProduction),
  },

  sms: {
    provider: process.env.SMS_PROVIDER || "console",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
  },

  uploads: {
    dir: process.env.UPLOAD_DIR || "uploads",
    maxSizeMb: Number(process.env.UPLOAD_MAX_MB) || 5,
  },
};

if (isProduction) {
  const weak = ["dev-access-secret-change-me", "dev-otp-secret-change-me"];
  if (weak.includes(env.jwt.accessSecret) || weak.includes(env.otp.secret)) {
    throw new Error("JWT_ACCESS_SECRET and OTP_SECRET must be set to strong values in production.");
  }
}
