const User = require('../model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')

exports.getAllusers = catchAsync( async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        result: users.length,
        data: {
            users,
        }
    })
})

exports.updateUser = catchAsync(async (req, res, next) => {
    const userId = req.params.id
    const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
    })
    if (!user) {
        return next(new AppError('ko co user voi id nay', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.deleteUser = catchAsync(async(req, res, next) => {
    const users = await User.findByIdAndDelete(req.params.id);

    if (!users) {
        return next(new AppError('KO co user voi id nay', 404))
    }

    res.status(204).json({
        status: "success",
        data: null,
        message: 'data hasn been deleted'
    })
})


exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    next();
})

exports.getUser = catchAsync( async(req, res,next) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
        return next(new AppError('No user with that id', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })

})