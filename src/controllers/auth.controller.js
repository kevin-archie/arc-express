const httpStatus = require('http-status');
const { authService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const user = await authService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

module.exports = {
  register,
};
