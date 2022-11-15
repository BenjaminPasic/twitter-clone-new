const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const {
  addNewCommentReply,
} = require("../controllers/CommentRepliesController");

router.post("/new", verifyCredentials, addNewCommentReply);

//router.get("/recent/:page", getRecentComments);

//router.get("/count", getCommentCount);

module.exports = router;
