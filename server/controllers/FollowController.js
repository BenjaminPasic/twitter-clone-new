const Follow = require("../models/Follow");
const { decodeJwtToken } = require("../utils/jwt");

const addNewFollow = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  const { profile_id } = req.body;
  try {
    if (userData.user_id === profile_id)
      throw "You can't follow your own profile";
    await Follow.create({
      user_id: userData.user_id,
      follows_user_id: profile_id,
    });
    return res.status(200);
  } catch (e) {
    if (e === "You can't follow your own profile") {
      return res
        .status(400)
        .json({ error: "You can't follow your own profile" });
    }
    console.log(e);
    return res.status(503);
  }
};

module.exports = {
  addNewFollow,
};
