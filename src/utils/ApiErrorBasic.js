// class ApiError extends Error {
//   constructor(statusCode, message, name, isOperational = true, status = 'error', stack = '') {
//     super(message);
//
//     console.log('message: ', message);
//     console.log('statusCode: ', statusCode);
//     console.log('isOperational: ', isOperational);
//     console.log('stack: ', stack);
//     console.log('this.constructor.name: ', this.constructor.name);
//
//     this.name = name || this.constructor.name;
//     this.status = status;
//     this.statusCode = statusCode;
//     this.isOperational = isOperational;
//
//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }
//
// module.exports = ApiError;
