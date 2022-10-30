const express = require("express");
const router = express.Router();
const {
  addNewComment,
  getRecentComments,
} = require("../controllers/CommentController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewComment);

router.get("/recent/:page", getRecentComments);

module.exports = router;
