const express = require('express');

const router = express.Router();

const { authBackoffice } = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const UserController = require('../../controllers/user.controller');

router
  .route('/')
  .post(authBackoffice, validate(userValidation.createUser), UserController.CreateUser)
  .get(authBackoffice, validate(userValidation.getUsers), UserController.ListUser);

router
  .route('/:id')
  .get(authBackoffice, validate(userValidation.getUser), UserController.DetailUser)
  .put(authBackoffice, validate(userValidation.updateUser), UserController.UpdateUser)
  .delete(authBackoffice, validate(userValidation.deleteUser), UserController.DeleteUser);

router
  .route('/:id/resend')
  .post(authBackoffice, validate(userValidation.resendInvitationEmail), UserController.ResendInvitationEmail);

module.exports = router;
