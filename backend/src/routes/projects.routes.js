const express = require("express");

const router = express.Router();

const projectsController = require("../controllers/projects.controller");

router.get("/projects", projectsController.getProjects);
router.post("/projects", projectsController.createProject);
router.delete("/projects/:id", projectsController.deleteProject);
router.put("/projects/:id", projectsController.updateProject);

module.exports = router;