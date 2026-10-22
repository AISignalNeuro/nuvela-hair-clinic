import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwt.accessSecret, { expiresIn: env.jwt.accessTtl });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}
