function requireAuth(req, res, next) {
  if (!req.session || !req.session.isAuthenticated) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please sign in to continue."
    });
  }

  next();
}

module.exports = {
  requireAuth
};
