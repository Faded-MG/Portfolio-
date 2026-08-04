const { readJson, writeJson, defaultExperience } = require("../data/store");

function getExperience(req, res) {
  const experience = readJson("experience.json", defaultExperience);

  return res.status(200).json({
    success: true,
    data: experience,
    message: "Experience loaded successfully"
  });
}

function createExperience(req, res) {
  const experience = readJson("experience.json", defaultExperience);
  const nextEntry = {
    id: Date.now(),
    ...req.body
  };

  experience.push(nextEntry);
  writeJson("experience.json", experience);

  return res.status(201).json({
    success: true,
    data: nextEntry,
    message: "Experience entry created successfully"
  });
}

function updateExperience(req, res) {
  const experience = readJson("experience.json", defaultExperience);
  const id = Number(req.params.id);
  const index = experience.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Experience entry not found"
    });
  }

  experience[index] = {
    ...experience[index],
    ...req.body
  };

  writeJson("experience.json", experience);

  return res.status(200).json({
    success: true,
    data: experience[index],
    message: "Experience entry updated successfully"
  });
}

function deleteExperience(req, res) {
  const experience = readJson("experience.json", defaultExperience);
  const id = Number(req.params.id);
  const index = experience.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Experience entry not found"
    });
  }

  const [deletedEntry] = experience.splice(index, 1);
  writeJson("experience.json", experience);

  return res.status(200).json({
    success: true,
    data: deletedEntry,
    message: "Experience entry deleted successfully"
  });
}

module.exports = {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
};
