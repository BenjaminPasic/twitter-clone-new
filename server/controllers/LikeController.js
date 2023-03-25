const Like = require("../models/Like");
const { decodeJwtToken } = require("../utils/jwt");
const dbConnection = require("../config/dbConnection");
const { QueryTypes } = require("sequelize");

const deleteExistingLike = async (postId, userId) => {
  try {
    await Like.destroy({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const addNewLike = async (req, res) => {
  const postInfo = req.body;
  const userInfo = await decodeJwtToken(req.cookies.token);

  console.log("Here", postInfo, userInfo)

  const post = await Like.count({
    where: {
      post_id: postInfo.post_id,
      user_id: userInfo.user_id,
    },
    raw: true,
  });

  if (post) {
    try {
      await deleteExistingLike(postInfo.post_id, userInfo.user_id);
      return res.status(200).end();
    } catch (e) {
      return res.status(503).json(e).end();
    }
  } else {
    try {
      await Like.create({
        user_id: userInfo.user_id,
        post_id: postInfo.post_id,
      });
      return res.status(200).json({ isSuccess: true }).end();
    } catch (e) {
      console.log(e);
      return res.status(503).json(e).end();
    }
  }
};

const countLikes = async (req, res) => {
  const postId = req.query["post_id"]?.trim();
  if (postId === undefined) throw "Local post";
  try {
    const postLikes = await Like.count({
      where: {
        post_id: postId,
      },
    });
    res.status(200).json({ postLikes }).end();
  } catch (e) {
    console.log(e);
    res.status(503).end();
  }
};

const checkIfCurrentUserLikedPost = async (req, res) => {
  const userInfo = await decodeJwtToken(req.cookies.token);
  try {
    const post_id = JSON.parse(req.query["post_id"]);
    const result = await dbConnection.query(
      `select p.id as post_id, l.user_id as liked_by_user_id from posts p
                                           join likes l on p.id = l.post_id
                                           where l.user_id = ${userInfo.user_id} and p.id = ${post_id}`,
      { type: QueryTypes.SELECT }
    );
    const hasUserLiked = result.length > 0;
    res.status(200).json({ hasUserLiked }).end();
  } catch (e) {
    console.log(e);
    res.status(503).end();
  }
};

module.exports = {
  addNewLike,
  countLikes,
  checkIfCurrentUserLikedPost,
};
