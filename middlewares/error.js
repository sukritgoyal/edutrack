class AppError extends Error {
	constructor(message, status) {
		super(message);
		this.status = status || 400;
	} 
};

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.status = err.status || 500;

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  return res.status(err.status).json({
    success: false,
    message: err.message,
  });
};

export default AppError;