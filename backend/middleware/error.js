const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  
  //Wrong MongoDb Id Error(CastError)
  if (err && err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
 
  // Mongoose Duplicate Key Error
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

    //Wrong Jwt Error
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is Invalid, Try again`;
      err = new ErrorHandler(message, 400);
    }

    //Jwt Expire Error
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is Expired, Try again`;
      err = new ErrorHandler(message, 400);
    }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
