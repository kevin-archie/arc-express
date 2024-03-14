const express = require('express');

const router = express.Router();

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const UserController = require('../../controllers/user.controller');
const { BACKOFFICE } = require('../../middlewares/constants/backoffice').MODULE;

router
  .route('/')
  .post(auth(BACKOFFICE), validate(userValidation.createUser), UserController.CreateUser)
  .get(auth(BACKOFFICE), validate(userValidation.getUsers), UserController.ListUser);

router
  .route('/:userId/')
  .get(auth(BACKOFFICE), validate(userValidation.getUser), UserController.DetailUser)
  .patch(auth(BACKOFFICE), validate(userValidation.updateUser), UserController.UpdateUser)
  .delete(auth(BACKOFFICE), validate(userValidation.deleteUser), UserController.DeleteUser);

router
  .route('/:userId/resed')
  .post(auth(BACKOFFICE), validate(userValidation.getUser), UserController.ResendInvitationEmail);

module.exports = router;
