const moment = require('moment');

function success(res, statusCode, message, data) {
  res.status(statusCode).json({
    statusCode,
    timestamp: `${moment().format('YYYY-MM-DD HH:mm:ss')} (Asia/Jakarta)`,
    success: true,
    message,
    data,
    error: null,
  });
}

function createError(res, statusCode, message, error) {
  res.status(statusCode).json({
    statusCode,
    timestamp: `${moment().format('YYYY-MM-DD HH:mm:ss')} (Asia/Jakarta)`,
    success: false,
    message,
    data: null,
    error,
  });
}

module.exports = {
  success,
  createError,
};
