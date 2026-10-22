import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export const hmac = (value, secret) => createHmac("sha256", secret).update(value).digest("hex");

export function safeEqual(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export const randomToken = (bytes = 48) => randomBytes(bytes).toString("base64url");

export const randomDigits = (length = 6) => Array.from({ length }, () => randomInt(0, 10)).join("");

// Human-friendly booking reference, e.g. "NV-26K7Q2M".
export function makeReference(prefix = "NV") {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const body = Array.from({ length: 5 }, () => alphabet[randomInt(0, alphabet.length)]).join("");
  return `${prefix}-${String(new Date().getFullYear()).slice(2)}${body}`;
}
