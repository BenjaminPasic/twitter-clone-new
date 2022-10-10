const User = require("../models/User");
const { encryptPassword, decryptPassword } = require("../utils/bcrypt");
const { createJwtToken, verifyJwtToken } = require("../utils/jwt");
const cookie = require("cookie");

const registerUser = async (req, res) => {
  try {
    const hashedPassword = await encryptPassword(req.body.password);
    await User.create({ ...req.body, password: hashedPassword });
    res.status(200).json("successfully registered");
  } catch (error) {
    res.status(400).json(error.errors[0].message);
  }
};

const loginUser = async (req, res) => {
  const { password, username } = req.body;
  try {
    const user = await User.findOne({
      where: { username },
      raw: true,
    });
    if (user === null) throw "Invalid username";
    const doPasswordsMatch = await decryptPassword(password, user.password);
    if (doPasswordsMatch === false) throw "Passwords do not match";
    const payload = {
      user_id: user.id,
      username: user.username,
    };
    const jwtToken = await createJwtToken(payload);
    res
      .status(200)
      .cookie("token", jwtToken, {
        maxAge: 5,
        httpOnly: true,
      })
      .end();
  } catch (error) {
    res.status(401).json(error);
  }
};

const logoutUser = (req, res) => {
  res.status(200).clearCookie("token").end();
};

const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (token === undefined || token === null) {
    res.status(200).json({ isTokenValid: false }).end();
  } else {
    const isTokenValid = await verifyJwtToken(token);
    res.status(200).json({ isTokenValid });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  logoutUser,
};
