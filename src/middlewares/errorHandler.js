const errorHandler = (err, _req, res, _next) => {
  console.error("Lỗi server:", err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Lỗi máy chủ",
  });
};

module.exports = errorHandler;
