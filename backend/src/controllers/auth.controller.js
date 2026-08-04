function login(req, res) {
  const { username, password } = req.body;

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "mahlet";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "123456";

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required"
    });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username };

    return res.status(200).json({
      success: true,
      data: {
        username
      },
      message: "Login successful"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password"
  });
}

function logout(req, res) {
  req.session.destroy(() => {
    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  });
}

module.exports = {
  login,
  logout
};