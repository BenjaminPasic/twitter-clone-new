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
  getUserBySearchParam,
  checkIfFollows,
} = require("../controllers/UserController");
const verifyCredentials = require("../middleware/verifyCredentials");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verifyToken", verifyToken);

router.get("/logout", logoutUser);

router.get("/profile", getUserProfile);

router.get("/username", getUsername);

router.put("/profileUpdate", verifyCredentials, profileUpdate);

router.get("/userSearch", verifyCredentials, getUserBySearchParam);

router.get("/checkIfFollows", verifyCredentials, checkIfFollows);

module.exports = router;
