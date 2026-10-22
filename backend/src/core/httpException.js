export class HttpException extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message = "Bad request", errors) {
    return new HttpException(400, message, errors);
  }

  static unauthorized(message = "Authentication required") {
    return new HttpException(401, message);
  }

  static forbidden(message = "You do not have permission to do this") {
    return new HttpException(403, message);
  }

  static notFound(message = "Resource not found") {
    return new HttpException(404, message);
  }

  static conflict(message = "Resource already exists") {
    return new HttpException(409, message);
  }

  static tooMany(message = "Too many requests, please try again later") {
    return new HttpException(429, message);
  }
}
