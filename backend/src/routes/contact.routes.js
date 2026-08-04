const express = require("express");
const { getContact, updateContact } = require("../controllers/contact.controller");


const router = express.Router();

router.get("/contact", getContact);
router.put("/contact", updateContact);

module.exports = router;
