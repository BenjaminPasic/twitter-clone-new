const express = require("express");
const router = express.Router();
const { addNewPost } = require("../controllers/PostController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewPost);

module.exports = router;
