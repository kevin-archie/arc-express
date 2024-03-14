const Joi = require('joi');

const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    role: Joi.string().valid('admin', 'superadmin').required(),
    module: Joi.string().valid('app', 'backoffice').required(),
    password: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    redirectTo: Joi.string().uri().required(),
  }),
};

const resetPassword = {
  headers: Joi.object().keys({
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
  body: Joi.object().keys({
    newPassword: Joi.string().required(),
    reEnterNewPassword: Joi.string().required(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
