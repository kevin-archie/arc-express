const Joi = require('joi');

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    role: Joi.string().required().valid('admin', 'superadmin'),
    module: Joi.string().valid('app', 'backoffice').required(),
    redirectTo: Joi.string().uri().required(),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string().allow('', null),
    status: Joi.string().valid('Waiting for confirmation', 'Active', 'Not verified').allow('', null),
    sortBy: Joi.string().allow('', null),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().allow('', null),
      email: Joi.string().email().allow('', null),
      role: Joi.string().valid('superadmin', 'admin').allow('', null),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.string().guid().required(),
  }),
};

const resendInvitationEmail = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    redirectTo: Joi.string().uri().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  resendInvitationEmail,
};
