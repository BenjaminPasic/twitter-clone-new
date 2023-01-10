const express = require("express");
const router = express.Router();
const { getConvoInfo } = require("../controllers/ConversationController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.get("/convoInfo", verifyCredentials, getConvoInfo);

module.exports = router;
