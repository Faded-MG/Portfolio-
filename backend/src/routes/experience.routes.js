const express = require("express");
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} = require("../controllers/experience.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/experience", getExperience);
router.post("/experience", requireAuth, createExperience);
router.put("/experience/:id", requireAuth, updateExperience);
router.delete("/experience/:id", requireAuth, deleteExperience);

module.exports = router;
