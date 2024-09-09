const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../controllers/userController")

//Register a User

exports.registeruser = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatars:{
            public_id:"This is sample image",
            url:"sampleImageUrl"
        }
    });

    res.status(201).json({
        success:true,
        user
    })

})
