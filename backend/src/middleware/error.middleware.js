function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: "Route not found"
  });
}

function globalErrorHandler(error, req, res, next) {
  console.error(error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal server error"
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};
