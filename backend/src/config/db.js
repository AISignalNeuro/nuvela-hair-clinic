import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Reuse one client across hot reloads in development.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: env.isProduction ? ["error"] : ["warn", "error"],
  });

if (!env.isProduction) globalForPrisma.__prisma = prisma;
