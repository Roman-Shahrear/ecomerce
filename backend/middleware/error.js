const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  // Ensure a valid status code
  if (statusCode < 100 || statusCode >= 600) {
    // If the status code is outside the valid range, set it to 500
    statusCode = 500;
  }

  // Set the response status code
  res.status(statusCode);

  // Handle specific error cases
  if (err && err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong Jwt Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // Jwt Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // Send the JSON response
  res.json({
    success: false,
    message: err.message,
  });
};
