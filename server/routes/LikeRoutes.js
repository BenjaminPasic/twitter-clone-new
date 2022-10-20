const express = require("express");
const router = express.Router();
const verifyCredentials = require("../middleware/verifyCredentials");
const { addNewLike } = require("../controllers/LikeController");

router.post("/new", verifyCredentials, addNewLike);

module.exports = router;
