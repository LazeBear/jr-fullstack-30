const BadRequestException = require('../exceptions/badRequest.exception');
const ForbiddenException = require('../exceptions/forbidden.exception');
const NotFoundException = require('../exceptions/NotFound.exception');
const logger = require('../utils/logger');
const { hashPassword, comparePassword } = require('../utils/password');
const { MAX_PASSWORD_HISTORY } = require('./constants');
const User = require('./user.model');
// GET /v1/users/:id
// GET /v1/users/me
const getMe = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new NotFoundException('User not found');
  }
  if (user._id !== userId) {
    throw new ForbiddenException(
      'Current user is not allowed to perform this action',
    );
  }
  res.json({
    success: true,
    data: user,
  });
};

const updateMe = async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  // TODO
  // if (user._id !== userId) {
  //   throw new ForbiddenException("Current user is not allowed to perform this action")
  // }
  res.json({
    success: true,
    data: user,
  });
};

const updateMyPassword = async (req, res) => {
  const { newPassword, currentPassword } = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId).exec();
  if (!user) {
    throw new NotFoundException('User not found');
  }
  if (user._id !== userId) {
    throw new ForbiddenException(
      'Current user is not allowed to perform this action',
    );
  }
  const isMatched = await comparePassword(currentPassword, user.password);
  if (!isMatched) {
    throw new UnauthorizedException('Invalid username or password');
  }
  for (const oldHash of user.passwordHistory) {
    const isSame = await comparePassword(newPassword, oldHash);
    if (isSame) {
      throw new BadRequestException(
        'New password must not be the same as the recent passwords',
      );
    }
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  let passwordHistory = [...user.passwordHistory, hashedPassword];
  if (passwordHistory.length > MAX_PASSWORD_HISTORY) {
    passwordHistory = passwordHistory.slice(-MAX_PASSWORD_HISTORY);
  }
  user.passwordHistory = passwordHistory;
  await user.save();

  logger.info('Password updated successful', { userId: user._id });

  res.json({
    success: true,
    message: 'Password updated',
  });
};

// DELETE /v1/users/:id (with role check)
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  // check if user is with a user role
  if (user.deletedAt) {
    throw new BadRequestException('User is already deleted');
  }
  user.deletedAt = new Date();
  await user.save();

  logger.info('User soft deleted', { userId: user._id, operator: req.user.id });
  res.json({
    success: true,
    message: 'User has been soft deleted',
  });
};

const restoreUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  // check if user is with a user role
  if (!user.deletedAt) {
    throw new BadRequestException('User is not deleted');
  }
  user.deletedAt = undefined;
  await user.save();

  logger.info('User restored', { userId: user._id, operator: req.user.id });
  res.json({
    success: true,
    message: 'User has been restored',
  });
};

const UserController = {
  deleteUser,
  restoreUser,
  updateMe,
  getMe,
  updateMyPassword,
};

module.exports = UserController;
