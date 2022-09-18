require("dotenv").config({ path: "../.env" });
const jwt = require("jsonwebtoken");

const createJwtToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const checkJwtToken = (jwtToken) => {
  console.log(jwtToken);
};

module.exports = {
  createJwtToken,
  checkJwtToken,
};
