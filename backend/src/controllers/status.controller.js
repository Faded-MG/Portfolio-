exports.getStatus = (req, res) => {
  res.status(200).json({
    message: "Portfolio API is running",
    status: "success"
  });
};