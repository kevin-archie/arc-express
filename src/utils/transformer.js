const _ = require('lodash');

function transformLoginResponse(payload) {
  const { user, session } = payload.data;

  _.unset(session, 'user');

  return {
    ...payload,
    data: {
      user: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
      },
      session,
    },
  };
}

module.exports = {
  transformLoginResponse,
};
