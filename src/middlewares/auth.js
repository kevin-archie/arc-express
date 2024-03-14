const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const supabase = require('../config/supabase');

const { BACKOFFICE } = require('./constants/backoffice').MODULE;

const authenticate = async (req, res, next, moduleName) => {
  try {
    const { accesstoken } = req.headers;

    if (!accesstoken) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Missing Authentication Token.');
    }

    const { data: checkToken } = await supabase.from('revoke_token').select().eq('token', accesstoken).single();

    if (checkToken) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Your session has expired or you've been logged out. Please log in again to continue accessing this resource."
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(accesstoken);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication Token.');
    }

    const { data: publicUser } = await supabase.from('user').select('*, role(*)').eq('id', user.id);

    if (publicUser[0].deleted_at) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Your account has been removed.');
    }

    req.current_user = {
      id: publicUser[0].id,
      name: publicUser[0].name,
      email: publicUser[0].email,
      role: publicUser[0].role.name,
      module_name: publicUser[0].role.module_name,
    };

    if (req.current_user.module_name !== moduleName) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized.');
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authBackoffice: async (req, res, next) => {
    await authenticate(req, res, next, BACKOFFICE);
  },
};
