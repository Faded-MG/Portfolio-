const express = require("express");

const router = express.Router();

const projectsController = require("../controllers/projects.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.get("/projects", projectsController.getProjects);
router.post("/projects", requireAuth, projectsController.createProject);
router.delete("/projects/:id", requireAuth, projectsController.deleteProject);
router.put("/projects/:id", requireAuth, projectsController.updateProject);

module.exports = router;