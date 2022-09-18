const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyToken,
} = require("../controllers/UserController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verifyToken", verifyToken);

module.exports = router;
