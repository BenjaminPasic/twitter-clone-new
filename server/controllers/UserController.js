const User = require("../models/User");
const { encryptPassword, decryptPassword } = require("../utils/bcrypt");
const {
  createJwtToken,
  verifyJwtToken,
  decodeJwtToken,
} = require("../utils/jwt");

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
    return res
      .status(200)
      .cookie("token", jwtToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(user.username);
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

const getUsername = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    const user = await User.findOne({
      attributes: ["username"],
      where: { id: userData.user_id },
      raw: true,
    });
    console.log(user);
    return res.status(200).json(user);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const getUserProfile = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  const username = req.query.username;
  try {
    const { name, surname, id, createdAt, location, bio } = await User.findOne({
      where: {
        username,
      },
      raw: true,
    });
    let returnData = {
      name,
      surname,
      id,
      location,
      bio,
      is_current_user: false,
      createdAt: createdAt,
    };
    if (userData.user_id === id) {
      return res.status(200).json({ ...returnData, is_current_user: true });
    }
    return res.status(200).json(returnData);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const profileUpdate = async (req, res) => {
  const { bio, location, updateUserId } = req.body;
  try {
    const userData = await decodeJwtToken(req.cookies.token);
    if (updateUserId !== userData.user_id) {
      return res
        .status(401)
        .json({ error: "You can't update a profile that isn't your own." });
    }
    await User.update({ bio, location }, { where: { id: updateUserId } });
    res.status(200).json({
      message: "Successfully updated",
    });
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  logoutUser,
  getUserProfile,
  profileUpdate,
  getUsername,
};
