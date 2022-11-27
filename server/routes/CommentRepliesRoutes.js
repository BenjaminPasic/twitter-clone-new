const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const {
  addNewCommentReply,
  getTenRecentComments,
} = require("../controllers/CommentRepliesController");

router.post("/new", verifyCredentials, addNewCommentReply);

router.get("/recent/:offset", getTenRecentComments);

//router.get("/count", getCommentCount);

module.exports = router;
