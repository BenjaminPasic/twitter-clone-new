const User = require("../models/User");
const { encryptPassword, decryptPassword } = require("../utils/bcrypt");

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
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
