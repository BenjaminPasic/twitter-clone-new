const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const {
  addNewLike,
  countLikes,
  checkIfCurrentUserLikedPost,
} = require("../controllers/LikeController");

router.post("/new", verifyCredentials, addNewLike);

router.get("/count", countLikes);

router.get("/checkIfLiked", checkIfCurrentUserLikedPost);

module.exports = router;
