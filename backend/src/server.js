import http from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/db.js";
import { logger } from "./utils/logger.js";

const server = http.createServer(app);

server.listen(env.port, () => {
  logger.info(`Nuvela API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

// Graceful shutdown so in-flight requests finish and DB connections close.
async function shutdown(signal) {
  logger.info(`${signal} received, shutting down`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (reason) => logger.error("Unhandled rejection", reason));
