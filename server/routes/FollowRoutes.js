const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const { addNewFollow } = require("../controllers/FollowController");

router.post("/new", verifyCredentials, addNewFollow);

module.exports = router;
