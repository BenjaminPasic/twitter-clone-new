const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const {
  likeComment,
  countCommentLikes,
  checkIfCurrentUserLikedComment,
} = require("../controllers/CommentLikeController");

router.post("/add", verifyCredentials, likeComment);

router.get("/count", countCommentLikes);

router.get("/checkifliked", checkIfCurrentUserLikedComment);

module.exports = router;
