const { readJson, writeJson, clone, defaultProfile } = require("../data/store");

function getProfile(req, res) {
  const profile = readJson("profile.json", defaultProfile);

  return res.status(200).json({
    success: true,
    data: profile,
    message: "Profile loaded successfully"
  });
}

function updateProfile(req, res) {
  const current = readJson("profile.json", defaultProfile);
  const nextProfile = {
    ...current,
    ...req.body,
    socialLinks: Array.isArray(req.body.socialLinks)
      ? req.body.socialLinks
      : current.socialLinks,
    skills: Array.isArray(req.body.skills)
      ? req.body.skills
      : current.skills,
    achievements: Array.isArray(req.body.achievements)
      ? req.body.achievements
      : current.achievements,
    stats: Array.isArray(req.body.stats)
      ? req.body.stats
      : current.stats
  };

  writeJson("profile.json", nextProfile);

  return res.status(200).json({
    success: true,
    data: nextProfile,
    message: "Profile updated successfully"
  });
}

module.exports = {
  getProfile,
  updateProfile
};
