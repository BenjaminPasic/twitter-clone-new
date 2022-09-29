require("dotenv").config({ path: "../.env" });
const jwt = require("jsonwebtoken");

const createJwtToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

const verifyJwtToken = async (jwtToken) => {
  try {
    await jwt.verify(jwtToken, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const decodeJwtToken = async (jwtToken) => {
  try {
    const decodedToken = await jwt.verify(jwtToken, process.env.JWT_SECRET);
    return decodedToken;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createJwtToken,
  verifyJwtToken,
  decodeJwtToken,
};
