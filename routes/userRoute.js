const express = require('express')
const authController = require('../controller/authController');
const userController = require('../controller/userController')

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout)

userRouter.post('/forgotPassword', authController.forgotPassword)
userRouter.patch('/resetPassword/:token', authController.resetPassword)

userRouter.use(authController.protect);


userRouter.patch('/updateMypassword', authController.updatePassword)

// userRouter.use(authController.restricTO('admin'))   

userRouter
    .route('/')
    .get(userController.getAllusers)

module.exports = userRouter