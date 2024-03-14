const express = require('express');

const router = express.Router();

const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const AuthController = require('../../controllers/auth.controller');

router.route('/register').post(validate(authValidation.register), AuthController.Register);
router.route('/login').post(validate(authValidation.login), AuthController.Login);
router.route('/forgot/password').post(validate(authValidation.forgotPassword), AuthController.ForgotPassword);
router.route('/reset/password').post(validate(authValidation.resetPassword), AuthController.ResetPassword);
router.route('/logout').delete(validate(authValidation.logout), AuthController.Logout);

module.exports = router;
