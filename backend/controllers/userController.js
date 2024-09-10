const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../model/userModel")

//Register a User

exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatars:{
            public_id:"This is sample image",
            url:"sampleImageUrl"
        }
    });

    const token = user.getJWTToken();

    res.status(201).json({
        success:true,
        token
    })
})

//Login User
exports.loginUser = catchAsyncError(async (req,res,next) => {
    const {email,password} = req.body;

    if(!email || password){
        return next(new ErrorHandler("Please Eenter Email & Password"));
    }

    const user = User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email & Password"))
    }
})
