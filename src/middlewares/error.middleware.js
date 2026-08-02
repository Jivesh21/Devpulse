const errorHandler = (err, req, res, next) => {
  console.error(" Error Stack:");
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
};

export default errorHandler;