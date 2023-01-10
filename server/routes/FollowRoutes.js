const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const {
  addNewFollow,
  findEveryoneUserFollows,
} = require("../controllers/FollowController");

router.post("/new", verifyCredentials, addNewFollow);

router.get("/find", verifyCredentials, findEveryoneUserFollows);

module.exports = router;
