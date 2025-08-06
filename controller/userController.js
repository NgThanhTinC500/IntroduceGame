const User = require('../model/userModel')


exports.getAllusers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        result: users.length,
        data: {
            users,
        }
    })
}

