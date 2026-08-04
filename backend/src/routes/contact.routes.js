const express = require("express");
const { getContact, updateContact } = require("../controllers/contact.controller");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/contact", getContact);
router.put("/contact", requireAuth, updateContact);

module.exports = router;
