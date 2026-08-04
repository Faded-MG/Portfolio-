const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profile.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile", requireAuth, updateProfile);

module.exports = router;
