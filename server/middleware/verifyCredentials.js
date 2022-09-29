const { verifyJwtToken } = require("../utils/jwt");

const verifyCredentials = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    const isTokenValid = await verifyJwtToken(token);
    if (!isTokenValid) throw "Invalid token";
    next();
  } catch (error) {
    res.status(401).json(error).end();
  }
};

module.exports = verifyCredentials;
