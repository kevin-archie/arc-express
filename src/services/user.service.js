const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const supabase = require('../config/supabase');
const pagination = require('../utils/pagination');
const { BACKOFFICE } = require('../middlewares/constants/backoffice').MODULE;

class Service {
  static async ListUser(page, limit, search, status, sortBy, currentModule) {
    let qry = supabase
      .from('user')
      .select('*, role!inner(name, module_name)')
      .is('deleted_at', null)
      .eq('role.module_name', currentModule);

    if (search) {
      qry = qry.or(`name.like.%${search}%,email.like.%${search}%`);
    }

    if (status) {
      qry = qry.eq('status', status);
    }

    let sortParams = ['name', 'asc'];

    if (sortBy) {
      sortParams = sortBy.split(',');

      sortParams[1] = Boolean(sortParams[1] === 'asc');
    }

    qry = qry.order(sortParams[0], {
      ascending: sortParams[1],
    });

    const { data: admin, error: adminError } = await qry;

    if (adminError) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, adminError.message);
    }

    // Array to store promises for all update operations
    // const updatePromises = [];

    // for (let i = 0; i < admin.length; i += 1) {
    //   const usr = admin[i];

    //   const checkLinkExpired = moment().format('HH:mm:ss') > moment(usr.created_at).add(15, 'minutes').format('HH:mm:ss');

    //   if (usr.status === 'Waiting for confirmation' && checkLinkExpired) {
    //     // Push the promise of the update operation to the array
    //     updatePromises.push(supabase.from('user').update({ status: 'Not verified' }).eq('id', usr.id));
    //     usr.status = 'Not verified';
    //   }
    // }

    // Wait for all update operations to complete
    // await Promise.all(updatePromises);

    const result = pagination(page, limit, admin);

    return result;
  }

  static async DetailUser(id) {
    const { data: admin, error: adminError } = await supabase.from('user').select('*, role(name, module_name)').eq('id', id);

    if (adminError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, adminError.message);

    return admin;
  }

  static async UpdateUser(id, name, email, role) {
    const payload = {};

    if (name) payload.name = name;
    if (email) payload.email = email;

    if (role) {
      const { data: findRole, error: findRoleError } = await supabase
        .from('role')
        .select()
        .eq('module_name', BACKOFFICE)
        .eq('name', role)
        .single();

      if (findRoleError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, findRoleError.message);

      payload.role_id = findRole.id;
    }

    if (Object.keys(payload).length > 0) {
      const { data: updateUser, error: updateUserError } = await supabase
        .from('user')
        .update(payload)
        .eq('id', id)
        .select('*, role(name, module_name)')
        .single();

      if (updateUserError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, updateUserError.message);

      return updateUser;
    }

    return 'No data to update';
  }

  static async CreateUser(name, email, role, module, redirectTo) {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: {
        name,
        role,
        module,
      },
      redirectTo,
    });

    if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);

    return data;
  }

  static async ResendInvitationEmail(email, redirectTo) {
    await supabase.from('user').update({ status: 'Waiting for confirmation' }).eq('email', email);

    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo,
    });

    if (error) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);

    return data;
  }

  static async DeleteUser(id) {
    const { data: userDeletedAt, error: userDeletedAtError } = await supabase
      .from('user')
      .update({
        deleted_at: new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Jakarta',
        }),
      })
      .eq('id', id)
      .select();

    if (userDeletedAtError) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, userDeletedAtError.message);

    return userDeletedAt;
  }
}

module.exports = Service;
