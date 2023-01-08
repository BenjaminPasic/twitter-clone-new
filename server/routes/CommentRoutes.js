const express = require("express");
const router = express.Router();
const {
  addNewComment,
  getRecentComments,
  getCommentCount,
  deleteComment,
} = require("../controllers/CommentController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewComment);

router.delete("/delete", verifyCredentials, deleteComment);

router.get("/recent/:page", getRecentComments);

router.get("/count", getCommentCount);

module.exports = router;
