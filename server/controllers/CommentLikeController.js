const CommentLike = require("../models/CommentLike");
const { decodeJwtToken } = require("../utils/jwt");
const dbConnection = require("../config/dbConnection");
const { QueryTypes } = require("sequelize");

const likeComment = async (req, res) => {
  const { post_id, comment_id } = req.body;
  const userInfo = await decodeJwtToken(req.cookies.token);

  const result = await CommentLike.count({
    where: {
      user_id: userInfo.user_id,
      comment_id,
    },
  });

  if (result) {
    try {
      await dislikeComment(comment_id, userInfo.user_id);
    } catch (e) {
      console.log(e);
      return res.status(503).send(e);
    }
  } else {
    try {
      await CommentLike.create({
        user_id: userInfo.user_id,
        comment_id,
        post_id,
      });
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return res.status(503).end();
    }
  }
};

const dislikeComment = async (comment_id, user_id) => {
  try {
    await CommentLike.destroy({
      where: {
        comment_id,
        user_id,
      },
    });
  } catch (e) {
    throw "Server error";
  }
};

const countCommentLikes = async (req, res) => {
  const commentId = req.query["comment_id"]?.trim();
  try {
    const commentLikes = await CommentLike.count({
      where: {
        comment_id: commentId,
      },
    });
    res.status(200).json({ commentLikes }).end();
  } catch (e) {
    console.log(e);
    res.status(503).end();
  }
};

const checkIfCurrentUserLikedComment = async (req, res) => {
  const commentId = req.query["comment_id"].trim();
  const userInfo = await decodeJwtToken(req.cookies.token);
  try {
    const result = await dbConnection.query(
      `select u.id, cl.comment_id from commentLikes cl
            JOIN users u on cl.user_id = u.id
            where u.id = ${userInfo.user_id} and cl.comment_id = ${commentId}
            `,
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
  likeComment,
  dislikeComment,
  countCommentLikes,
  checkIfCurrentUserLikedComment,
};
