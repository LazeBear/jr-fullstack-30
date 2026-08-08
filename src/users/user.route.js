const express = require('express');
const UserController = require('./user.controller');
const roleGuard = require('../middleware/roleGuard.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const {
  updateMeSchema,
  updateMyPasswordSchema,
  updateAvatarSchema,
} = require('./user.validation');

const userRouter = express.Router();

userRouter.get('/me', UserController.getMe);
userRouter.put('/me', validateBody(updateMeSchema), UserController.updateMe);
userRouter.put(
  '/me/password',
  validateBody(updateMyPasswordSchema),
  UserController.updateMyPassword,
);
userRouter.post(
  '/me/avatar',
  validateBody(updateAvatarSchema),
  UserController.updateAvatar,
);

userRouter.delete('/:id', roleGuard('admin'), UserController.deleteUser);
userRouter.post('/:id/restore', roleGuard('admin'), UserController.restoreUser);

module.exports = userRouter;
