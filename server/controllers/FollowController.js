const Follow = require("../models/Follow");
const dbConnection = require("../config/dbConnection");
const { decodeJwtToken } = require("../utils/jwt");
const { QueryTypes } = require("sequelize");

const addNewFollow = async (req, res) => {
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

const findEveryoneUserFollows = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    const results = await dbConnection.query(
      `SELECT u.id, u.name, u.surname, u.username FROM follows f
                                            JOIN users u ON f.follows_user_id = u.id
                                            where f.user_id = ${userData.user_id}`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json(results).end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

module.exports = {
  addNewFollow,
  findEveryoneUserFollows,
};
