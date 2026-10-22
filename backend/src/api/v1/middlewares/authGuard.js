import { prisma } from "../../../config/db.js";
import { HttpException } from "../../../core/httpException.js";
import { verifyAccessToken } from "../../../utils/jwt.js";

async function loadUser(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw HttpException.unauthorized("Session expired, please sign in again");
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw HttpException.unauthorized();
  return user;
}

// Requires a valid access token and attaches req.user.
export async function requireAuth(req, res, next) {
  try {
    const user = await loadUser(req);
    if (!user) throw HttpException.unauthorized();
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// Attaches req.user when a valid token is present but never blocks the request.
export async function optionalAuth(req, res, next) {
  try {
    req.user = await loadUser(req);
  } catch {
    req.user = null;
  }
  next();
}
