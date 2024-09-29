
export abstract class HttpError extends Error {
  abstract readonly status: number;
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  readonly status = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends HttpError {
  readonly status = 401;
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends HttpError {
  readonly status = 403;
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends HttpError {
  readonly status = 404;
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends HttpError {
  readonly status = 409;
  constructor(message: string) {
    super(message);
    this.name = "ConflictException";
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends HttpError {
  readonly status = 500;
  constructor(message: string) {
    super(message);
    this.name = "InternalServerErrorException";
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

