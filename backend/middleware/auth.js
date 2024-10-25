const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken")
const User = require("../model/userModel")


exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id);
        
        console.log("Authenticated User Role:", req.user.role); // Debug line
        
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token, please login again", 401));
    }
});


exports.authorizedRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(
                `Role : ${req.user.role} is not allowed to use this resource`, 403
            ));
        }
        next();
    };
};