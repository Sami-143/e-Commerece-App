const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const { sendEmail } = require('../utils/sendEmail');
const crypto = require('crypto');

//Register a User

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password,
        avatars: {
            public_id: "This is sample image",
            url: "sampleImageUrl"
        }
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token
    })
})

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
});

// logout user 
exports.logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true//HTTPOnly cookies are website cookies marked with the HTTPOnly attribute, which prevents client-side scripts from capturing data stored on these cookies.
    })
    res.status(200).json({
        sucess: true,
        message: "Logged Out"
    })
});


//Forgot Password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });// validateBeforeSave:false is used to avoid the validation of the fields before saving the data

    //Create reset password URL
    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message: message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;//if there is any error then reset the resetPasswordToken field to undefined
        user.resetPasswordExpire = undefined;//if there is any error then reset the resetPasswordExpire field to undefined
        await user.save({ validateBeforeSave: false });//if there is any error then save the user data with validateBeforeSave:false
        return next(new ErrorHandler(error.message, 500));
    }
});

//Reset Password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //Hash URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });


    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    //Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

//get User Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });

})


exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);

});

//update user profile

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name : req.body.name,
        email : req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true,
        useFindAndModify : false
    });

    res.status(200).json({
        success : true
    });

});


//Admin Routes

//Get all users
exports.getAllUsers  = catchAsyncError(async(req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        success : true,
        users
    });
})

//Get Single User Details
exports.getSingleUserAdmin = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not found with id ${req.params.id}`));
    }
    res.status(200).json({
        success : true,
        user
    })
});
