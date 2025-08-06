const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please tell us your email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail, 'Please provide valid email'],
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password
            },
            message: 'Password are not the same !'
        },

    },
    // mặc định passwordChangeAt là null khi tạo user mới
    passwordChangeAt: Date,
    active: {
        type: Boolean,
        default: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});


// HASH PASSWORD
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})


//  COMPARE PASSWORD
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}


// FIND USER ACTIVE = NOT FALSE
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next();
})


// CHECK XEM CÓ ĐỔI MK SAU KHI PHÁT TOKEN CHƯA
userSchema.methods.changePasswordAfter = function (JWTtimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(this.passwordChangeAt.getTime() / 1000, 10)
        return JWTtimestamp < changedTimestamp;
    }
    return false
}

// GENERATE RANDOM TOKEN
userSchema.methods.generateRandomToken  = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}


const User = mongoose.model('User', userSchema)

module.exports = User;  