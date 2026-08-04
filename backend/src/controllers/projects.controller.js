const { readJson, writeJson, defaultProjects } = require("../data/store");

function getProjects(req, res) {
  const projects = readJson("projects.json", defaultProjects);

  return res.status(200).json({
    success: true,
    data: projects,
    message: "Projects loaded successfully"
  });
}

function createProject(req, res) {
  const projects = readJson("projects.json", defaultProjects);
  const { title, description, category, technologies, github, demo, banner, featured } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Title, description, and category are required"
    });
  }

  const newProject = {
    id: Date.now(),
    title,
    description,
    category,
    technologies: Array.isArray(technologies) ? technologies : [],
    github: github || "",
    demo: demo || "",
    banner: banner || "project-banner-1",
    featured: Boolean(featured)
  };

  projects.push(newProject);
  writeJson("projects.json", projects);

  return res.status(201).json({
    success: true,
    data: newProject,
    message: "Project created successfully"
  });
}

function deleteProject(req, res) {
  const projects = readJson("projects.json", defaultProjects);
  const id = Number(req.params.id);
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const [deletedProject] = projects.splice(projectIndex, 1);
  writeJson("projects.json", projects);

  return res.status(200).json({
    success: true,
    data: deletedProject,
    message: "Project deleted successfully"
  });
}

function updateProject(req, res) {
  const projects = readJson("projects.json", defaultProjects);
  const id = Number(req.params.id);
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  projects[projectIndex] = {
    ...projects[projectIndex],
    ...req.body,
    technologies: Array.isArray(req.body.technologies)
      ? req.body.technologies
      : projects[projectIndex].technologies,
    featured: Boolean(req.body.featured)
  };

  writeJson("projects.json", projects);

  return res.status(200).json({
    success: true,
    data: projects[projectIndex],
    message: "Project updated successfully"
  });
}

module.exports = {
  getProjects,
  createProject,
  deleteProject,
  updateProject
};