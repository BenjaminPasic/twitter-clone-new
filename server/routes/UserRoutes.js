const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyToken,
  logoutUser,
} = require("../controllers/UserController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verifyToken", verifyToken);

router.get("/logout", logoutUser);

module.exports = router;
