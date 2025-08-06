const express = require('express')
const authController = require('../controller/authController');
const userController = require('../controller/userController')

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);




userRouter.get('/getAllUser', userController.getAllusers)

module.exports = userRouter