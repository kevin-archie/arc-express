const BaseError = require('./BaseError');

class ApiError extends BaseError {
  // the isOperational set to false is on purpose, and let the isOperational in each service as needed
  constructor(httpCode, message, isOperational = false, name) {
    console.log("== MASUK APIERROR2 ==");
    console.log("name: " + name);
    console.log("http: " + httpCode);
    console.log("message: " + message);
    super(httpCode, message, name, 'error', isOperational);
  }
}

module.exports = ApiError;
