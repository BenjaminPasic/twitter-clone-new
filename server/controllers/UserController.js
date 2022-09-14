const User = require("../models/User");
const { hashPassword } = require("../utils/bcrypt");

const registerUser = async (req, res) => {
  const hashedPassword = await hashPassword(req.body.password);
  try {
    await User.create({ ...req.body, password: hashedPassword });
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.errors[0].message);
  }
};

const loginUser = (req, res) => {
  console.log(req.body);
};

module.exports = {
  registerUser,
  loginUser,
};
