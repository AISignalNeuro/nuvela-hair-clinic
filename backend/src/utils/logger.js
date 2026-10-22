// Minimal leveled logger with timestamps; swap for pino/winston if structured logs are needed.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = LEVELS[process.env.LOG_LEVEL] ?? (process.env.NODE_ENV === "production" ? LEVELS.info : LEVELS.debug);

function write(level, message, meta) {
  if (LEVELS[level] < threshold || process.env.NODE_ENV === "test") return;
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;
  const out = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  if (meta === undefined) out(line);
  else out(line, meta);
}

export const logger = {
  debug: (msg, meta) => write("debug", msg, meta),
  info: (msg, meta) => write("info", msg, meta),
  warn: (msg, meta) => write("warn", msg, meta),
  error: (msg, meta) => write("error", msg, meta),
};
