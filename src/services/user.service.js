const httpStatus = require('http-status');
const logger = require('../config/logger');
const client = require('../config/supabase');
const { normalizeName, wordsLength, normalizePhone } = require('../utils/tools');
const ApiError = require('../utils/ApiErrorBasic');

function _splitName(firstName, lastName) {
  const normalizedFirstName = normalizeName(firstName);

  const nameLength = wordsLength(normalizedFirstName);
  if (!lastName && nameLength > 1) {
    return {
      first_name: normalizedFirstName.split(' ').slice(0, -1).join(' '),
      last_name: normalizedFirstName.split(' ').slice(-1).join(' '),
    };
  }

  return {
    first_name: normalizedFirstName,
    last_name: normalizeName(lastName),
  };
}

function _transformUserBody(userBody) {
  const splittedName = _splitName(userBody.first_name, userBody.last_name);
  const normalizedPhone = normalizePhone(userBody.phone);

  return {
    ...userBody,
    ...splittedName,
    phone: normalizedPhone,
  };
}

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  try {
    const userPayload = _transformUserBody(userBody);

    // eslint-disable-next-line camelcase
    const { email, phone, password, first_name, last_name } = userPayload;

    const { error, data: createdAuth } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          phone,
        },
      },
    });

    if (error) {
      logger.error(error);
      throw new Error(error.message);
    }

    const { data: createdUser } = await client.from('user').select('*').eq('id', createdAuth.user.id).single();

    return createdUser;
  } catch (error) {
    logger.error(error);
  }
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
