const { success } = require('../utils/response');
const Service = require('../services/user.service');

class Controller {
  static async ListUser(req, res, next) {
    try {
      const { page, limit, search, sortBy, status } = req.query;

      const result = await Service.ListUser(page, limit, search, status, sortBy, req.current_user.module_name);
      success(res, 200, 'Successfully get list admin.', result);
    } catch (err) {
      next(err);
    }
  }

  static async DetailUser(req, res, next) {
    try {
      const { id } = req.query;

      const result = await Service.DetailUser(id);

      success(res, 200, `Successfully get detail admin.`, result);
    } catch (err) {
      next(err);
    }
  }

  static async UpdateUser(req, res, next) {
    try {
      const { id, name, email, role } = req.body;

      const result = await Service.UpdateUser(id, name, email, role);

      success(res, 200, `Successfully edit admin.`, result);
    } catch (err) {
      next(err);
    }
  }

  static async CreateUser(req, res, next) {
    try {
      const { name, email, role, module, redirectTo } = req.body;

      const result = await Service.CreateUser(name, email, role, module, redirectTo);

      success(res, 200, `Successfully send email to ${email}`, result);
    } catch (err) {
      next(err);
    }
  }

  static async ResendInvitationEmail(req, res, next) {
    try {
      const { email, redirectTo } = req.body;

      const result = await Service.ResendInvitationEmail(email, redirectTo);

      success(res, 200, `Successfully resend invitation email to ${email}`, result);
    } catch (err) {
      next(err);
    }
  }

  static async DeleteUser(req, res, next) {
    try {
      const { id } = req.query;

      const result = await Service.DeleteUser(id);

      success(res, 200, `Successfully delete admin sales.`, result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
