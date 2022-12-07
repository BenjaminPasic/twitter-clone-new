const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  verifyToken,
  logoutUser,
  getUserProfile,
  profileUpdate,
  getUsername,
} = require("../controllers/UserController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verifyToken", verifyToken);

router.get("/logout", logoutUser);

router.get("/profile", getUserProfile);

router.get("/username", getUsername);

router.put("/profileUpdate", profileUpdate);

module.exports = router;
