const express = require('express');
const authRouter = require('./auth/auth.routes');
const authGuard = require('./middleware/authGuard.middleware');
const userRouter = require('./users/user.route');
const uploadRouter = require('./upload/upload.routes');
const resumeRouter = require('./resumes/resume.routes');

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/users', authGuard, userRouter);
v1Router.use('/upload', authGuard, uploadRouter);
v1Router.use('/resumes', authGuard, resumeRouter);

module.exports = v1Router;
