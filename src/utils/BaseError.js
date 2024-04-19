class BaseError extends Error {
  constructor(httpCode, message, name, status, isOperational = false, stack = '') {
    super(message);

    this.status = status;
    this.name = name || this.constructor.name;
    this.statusCode = httpCode;
    this.isOperational = isOperational;

    console.log("this ==> ", this);
    console.log("===");

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = BaseError;
