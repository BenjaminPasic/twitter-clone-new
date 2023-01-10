const Follow = require("../models/Follow");
const { decodeJwtToken } = require("../utils/jwt");

const addNewFollow = async (req, res) => {
  console.log("trigga");
  const userData = await decodeJwtToken(req.cookies.token);
  const { profile_id } = req.body;
  try {
    if (userData.user_id === profile_id)
      throw "You can't follow your own profile";
    const doesUserAlreadyFollow = await Follow.findOne({
      where: {
        user_id: userData.user_id,
        follows_user_id: profile_id,
      },
      raw: true,
    });
    if (doesUserAlreadyFollow === null) {
      await Follow.create({
        user_id: userData.user_id,
        follows_user_id: profile_id,
      });
      return res.status(200);
    } else {
      try {
        await unfollow(userData.user_id, profile_id);
        return res.status(200);
      } catch (e) {
        console.log(e);
        return res.status(503);
      }
    }
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

const unfollow = async (user_id, follows_user_id) => {
  console.log("unfollwo trigga");
  try {
    await Follow.destroy({
      where: {
        user_id,
        follows_user_id,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  addNewFollow,
};
