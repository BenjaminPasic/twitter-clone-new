const dbConnection = require("../config/dbConnection");
const CommentReplies = require("../models/CommentReplies");
const { decodeJwtToken } = require("../utils/jwt");
const { QueryTypes } = require("sequelize");
const { raw } = require("express");

const addNewCommentReply = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    const addedReply = await CommentReplies.create(
      {
        ...req.body,
        written_by_user_id: userData.user_id,
      },
      {
        raw: true,
      }
    );
    return res
      .status(200)
      .json({ ...addedReply.dataValues, username: userData.username })
      .end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

const getTenRecentComments = async (req, res) => {
  const offset = +req.params.offset;
  const commentId = +req.query["comment_id"];
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    let replies = await dbConnection.query(
      `select commentReplies.*, u.username from commentReplies
                join users u on commentReplies.written_by_user_id = u.id
                where commentReplies.written_on_comment_id = ${commentId}
                LIMIT 10 OFFSET ${offset}`,
      { type: QueryTypes.SELECT }
    );
    replies = replies.map((reply) => {
      if (reply.written_by_user_id === userData.user_id) {
        return { ...reply, written_by_current_user: true };
      }
      return reply;
    });
    return res.status(200).json(replies).end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

module.exports = {
  addNewCommentReply,
  getTenRecentComments,
};
