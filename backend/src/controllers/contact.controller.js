const { readJson, writeJson, defaultContact } = require("../data/store");

function getContact(req, res) {
  const contact = readJson("contact.json", defaultContact);

  return res.status(200).json({
    success: true,
    data: contact,
    message: "Contact information loaded successfully"
  });
}

function updateContact(req, res) {
  const current = readJson("contact.json", defaultContact);
  const nextContact = {
    ...current,
    ...req.body,
    socialLinks: Array.isArray(req.body.socialLinks)
      ? req.body.socialLinks
      : current.socialLinks
  };

  writeJson("contact.json", nextContact);

  return res.status(200).json({
    success: true,
    data: nextContact,
    message: "Contact information updated successfully"
  });
}

module.exports = {
  getContact,
  updateContact
};
