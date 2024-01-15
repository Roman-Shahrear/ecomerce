const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    try {
        const decodeData = jwt.verify(token, process.env.JWT_SECRET);
        
        const userId = decodeData.id; // Updated to use 'id' property or decoded token need to store in a variable for use it

        req.user = await User.findOne({ _id: userId });

        if (!req.user) {
            return next(new ErrorHandler("User not found", 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token. Please login again.", 401));
    }
});



exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
    try {
            if (!req.user || !req.user.role) {
                return next(
                    new ErrorHandler(
                        "User role not defined or user not authenticated",
                        403
                    )
                );
            }

            if (!roles.includes(req.user.role)) {
                return next(
                    new ErrorHandler(
                        `Role: ${req.user.role} is not allowed to access this resource`,
                        403
                    )
                );
            }

            next();
        } catch (error) {
            // Handle any synchronous errors here
            next(error);
        };
    };
};