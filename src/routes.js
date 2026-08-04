const express = require('express');
const authRouter = require('./auth/auth.routes');
const authGuard = require('./middleware/authGuard.middleware');
const userRouter = require('./users/user.route');

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/users', authGuard, userRouter);

module.exports = v1Router;
