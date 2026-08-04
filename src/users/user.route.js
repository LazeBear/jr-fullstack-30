const express = require('express');
const UserController = require('./user.controller');
const roleGuard = require('../middleware/roleGuard.middleware');

const userRouter = express.Router();

userRouter.get('/me');

userRouter.delete('/:id', roleGuard('admin'), UserController.deleteUser);
userRouter.post('/:id/restore', roleGuard('admin'), UserController.restoreUser);

module.exports = userRouter;
