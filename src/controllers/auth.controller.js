const { success } = require('../utils/response');
const Service = require('../services/auth.service');

class Controller {
  static async Register(req, res, next) {
    try {
      const { name, email, role, password, module } = req.body;

      const result = await Service.Register(name, email, role, password, module);

      success(res, 201, 'Successfully create new user', result);
    } catch (err) {
      next(err);
    }
  }

  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await Service.Login(email, password);

      success(res, 200, 'Successfully login.', result);
    } catch (err) {
      next(err);
    }
  }

  static async ForgotPassword(req, res, next) {
    try {
      const { email, redirectTo } = req.body;

      const result = await Service.ForgotPassword(email, redirectTo);

      success(res, 200, `Email reset password has been sent to ${email}`, result);
    } catch (err) {
      next(err);
    }
  }

  static async ResetPassword(req, res, next) {
    try {
      const { newPassword, reEnterNewPassword } = req.body;
      const { accesstoken, refreshtoken } = req.headers;

      const result = await Service.ResetPassword(newPassword, reEnterNewPassword, accesstoken, refreshtoken);

      success(res, 200, 'Successfully change password.', result);
    } catch (err) {
      next(err);
    }
  }

  static async Logout(req, res, next) {
    try {
      const { accesstoken } = req.headers;

      const result = await Service.Logout(accesstoken);
      success(res, 200, 'Successfully logout.', result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
