const express = require("express");
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} = require("../controllers/experience.controller");


const router = express.Router();

router.get("/experience", getExperience);

router.post("/experience", createExperience);

router.put("/experience/:id", updateExperience);

router.delete("/experience/:id", deleteExperience);

module.exports = router;
