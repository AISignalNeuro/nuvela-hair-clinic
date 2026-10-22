import { HttpException } from "../../../core/httpException.js";

// Validates req[source] against a zod schema and replaces it with the parsed value.
export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message }));
      return next(new HttpException(422, "Validation failed", errors));
    }
    if (source === "query") req.validatedQuery = result.data;
    else req[source] = result.data;
    return next();
  };
