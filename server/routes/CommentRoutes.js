const express = require("express");
const router = express.Router();
const {
  addNewComment,
  getRecentComments,
  getCommentCount,
} = require("../controllers/CommentController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewComment);

router.get("/recent/:page", getRecentComments);

router.get("/count", getCommentCount);

module.exports = router;
