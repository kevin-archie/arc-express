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
  .route('/:userId/')
  .get(authBackoffice, validate(userValidation.getUser), UserController.DetailUser)
  .patch(authBackoffice, validate(userValidation.updateUser), UserController.UpdateUser)
  .delete(authBackoffice, validate(userValidation.deleteUser), UserController.DeleteUser);

router.route('/:userId/resed').post(authBackoffice, validate(userValidation.getUser), UserController.ResendInvitationEmail);

module.exports = router;
