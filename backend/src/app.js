const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const statusRoutes = require("./routes/status.routes");
const projectsRoutes = require("./routes/projects.routes");
const experienceRoutes = require("./routes/experience.routes");
const profileRoutes = require("./routes/profile.routes");
const contactRoutes = require("./routes/contact.routes");
const authRoutes = require("./routes/auth.routes");
const { notFoundHandler, globalErrorHandler } = require("./middleware/error.middleware");

const app = express();
const frontendRoot = path.join(__dirname, "..", "..", "frontend");

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  session({
    name: "portfolio.sid",
    secret: process.env.SESSION_SECRET || "portfolio-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 12
    }
  })
);

app.use("/frontend", express.static(frontendRoot));

app.use("/api", statusRoutes);
app.use("/api", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", projectsRoutes);
app.use("/api", experienceRoutes);
app.use("/api", contactRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;