const express = require('express');
const authController = require('./auth.controller');
const { validateBody } = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');
const authGuard = require('../middleware/authGuard.middleware');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  authController.register,
);
authRouter.post('/login', validateBody(loginSchema), authController.login);

authRouter.get('/private', authGuard,(req,res)=>{
  res.json('ok')
})

module.exports = authRouter;
