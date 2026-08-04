const ConflictException = require('../exceptions/conflict.exception');
const crypto = require('crypto');
const UnauthorizedException = require('../exceptions/unauthorized.exception');
const ValidationException = require('../exceptions/validation.exception');
const User = require('../users/user.model');
const { signAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');
const { hashPassword, comparePassword } = require('../utils/password');
const BadRequestException = require('../exceptions/badRequest.exception');
const { lte } = require('zod');
const { MAX_PASSWORD_HISTORY } = require('../users/constants');

const RESET_ACTION_EXPIRY_TIME = 10 * 60 * 1000;

const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    // hanlde errors
    // error middleware chain
    // next(e)
    throw new ConflictException('Email already exists!');
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    passwordHistory: [hashedPassword],
  });
  // success: boolean
  // data
  // error
  const accessToken = signAccessToken({ id: user._id });
  res.json({
    success: true,
    data: {
      user,
      accessToken,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (!user) {
    throw new UnauthorizedException('Email and password mismatch');
  }

  const isMatched = await comparePassword(password, user.password);
  if (!isMatched) {
    throw new UnauthorizedException('Invalid username or password');
  }
  if (user.deletedAt) {
    throw new UnauthorizedException('Account has been deleted');
  }
  const accessToken = signAccessToken({
    id: user._id,
    accountType: user.accountType,
  });
  // const accessToken = signAccessToken({ id: user._id });
  res.json({
    success: true,
    data: {
      user,
      accessToken,
    },
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    // PII
    // hash
    logger.info(`user try to reset password with email: ${email}`);
    return res.json({
      success: true,
      message: 'If the email exists, a verification code will be sent',
    });
  }
  // 6 digits
  const code = Math.random().toString().slice(2, 8);

  // redis
  user.resetCode = code;
  user.resetCodeExpiry = new Date(Date.now() + RESET_ACTION_EXPIRY_TIME);
  await user.save();
  res.json({ success: true, message: 'verification code has been sent' });
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email }).exec();
  if (!user || user.resetCode !== code || user.resetCodeExpiry < new Date()) {
    throw new ValidationException('Invalid or expired code');
  }
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiry = new Date(Date.now() + RESET_ACTION_EXPIRY_TIME);
  await user.save();

  res.json({
    success: true,
    data: {
      resetToken,
    },
  });
};

const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;
  const user = await User.findOne({ email }).exec();
  if (
    !user ||
    user.resetToken !== resetToken ||
    user.resetTokenExpiry < new Date()
  ) {
    throw new ValidationException('Invalid or expired token');
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
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();
  res.json({
    success: true,
    message: 'Password reset successful',
  });
};

const authController = {
  register,
  login,
  forgotPassword,
  verifyCode,
  resetPassword,
};

module.exports = authController;
