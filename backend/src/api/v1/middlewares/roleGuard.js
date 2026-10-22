import { HttpException } from "../../../core/httpException.js";

// Usage: router.get("/", requireAuth, roleGuard("ADMIN", "EDITOR"), handler)
export const roleGuard =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return next(HttpException.unauthorized());
    if (!roles.includes(req.user.role)) return next(HttpException.forbidden());
    return next();
  };
