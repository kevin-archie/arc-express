const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const supabase = require('../config/supabase');

const { BACKOFFICE } = require('../middlewares/constants/backoffice').MODULE;

class Service {
  static async Register(name, email, role, password, module) {
    // const normalized_name = normalizeName(name);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          module,
        },
      },
    });

    if (error) throw error;

    return data;
  }

  static async Login(email, password) {
    const { data: user, error: userError } = await supabase
      .from('user')
      .select('email, deleted_at, role(name, module_name)')
      .eq('email', email)
      .single();

    if (userError || !user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong Email.');

    if (user.deleted_at)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'The user account associated with the provided email address has been deleted.'
      );

    if (user.role.module_name !== BACKOFFICE)
      throw new ApiError(httpStatus.FORBIDDEN, 'Access to Backoffice is unauthorized.');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new ApiError(httpStatus.UNAUTHORIZED, 'Wrong Password.');

    const { data: profile, error: profileError } = await supabase
      .from('user')
      .select('id, name, email, employee_number, status, role(name, module_name)')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;
    return { ...data, profile };
  }

  static async ForgotPassword(email, redirectTo) {
    const checkEmail = await supabase.from('user').select('email').eq('email', email);

    if (checkEmail.data.length < 1) throw new ApiError(httpStatus.UNAUTHORIZED, 'Email is not registered.');

    const resertPassword = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (resertPassword.error) {
      throw resertPassword.error;
    }

    return null;
  }

  static async ResetPassword(newPassword, reEnterNewPassword, accessToken, refreshToken) {
    if (newPassword !== reEnterNewPassword)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Passwords do not match. Please ensure both entries are the same and try again.'
      );

    const session = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (session.error) throw session.error;

    const updateUser = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateUser.error) {
      throw updateUser.error;
    }
    return updateUser.data;
  }

  static async Logout(accessToken) {
    const { error } = await supabase.from('revoke_token').insert({ token: accessToken }).select();

    if (error) throw error;

    const {
      data: { user },
    } = await supabase.auth.getUser(accessToken);

    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Authentication Token.');

    const { data: publicUser, error: publicUserError } = await supabase.from('user').select('*, role(*)').eq('id', user.id);

    if (publicUserError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, publicUserError);
    return `${publicUser[0].email} has been logged out.`;
  }
}

module.exports = Service;
