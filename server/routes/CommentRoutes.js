const express = require("express");
const router = express.Router();
const { addNewComment } = require("../controllers/CommentController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewComment);

module.exports = router;
