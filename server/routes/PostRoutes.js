const express = require("express");
const router = express.Router();
const {
  addNewPost,
  getRecentPosts,
  deletePost,
} = require("../controllers/PostController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/new", verifyCredentials, addNewPost);

router.get("/recent/:page", verifyCredentials, getRecentPosts);

router.delete("/delete", verifyCredentials, deletePost);

module.exports = router;
