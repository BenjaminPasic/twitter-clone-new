const Comment = require("../models/Comment");
const { decodeJwtToken } = require("../utils/jwt");
const dbConnection = require("../config/dbConnection");
const { QueryTypes } = require("sequelize");

const addNewComment = async (req, res) => {
  const { post_id, comment } = req.body;
  try {
    const userData = await decodeJwtToken(req.cookies.token);
    let lastComment = await Comment.create(
      {
        written_by_user_id: userData.user_id,
        written_on_post_id: post_id,
        comment: comment,
      },
      { raw: true }
    );
    lastComment = { ...lastComment.dataValues, username: userData.username };
    return res
      .status(200)
      .json({ ...lastComment, username: userData.username })
      .end();
  } catch (e) {
    return res.status(503).end();
  }
};

const getRecentComments = async (req, res) => {
  const { page } = req.params;
  const postId = req.query["post_id"];

  try {
    const recentComments = await dbConnection.query(
      `SELECT c.id, c.written_by_user_id, c.written_on_post_id,
          c.comment, u.username, u.createdAt, cr.reply, cr.written_by_user_id as reply_written_by_user_id,
          u2.username as reply_username, cr.createdAt as reply_createdAt
          FROM comments c
          JOIN users u on c.written_by_user_id = u.id
          LEFT JOIN commentReplies cr on c.id = cr.written_on_comment_id
          left join users u2 on u2.id = cr.written_by_user_id
          HAVING written_on_post_id = ${postId}
          ORDER BY c.createdAt DESC
          LIMIT 10 OFFSET ${page}`,
      { type: QueryTypes.SELECT }
    );
    return res.status(200).json({ recentComments }).end();
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

const getCommentCount = async (req, res) => {
  const postId = req.query["post_id"];

  try {
    const commentCount = await Comment.count({
      where: {
        written_on_post_id: postId,
      },
    });
    return res.status(200).json(commentCount);
  } catch (e) {
    console.log(e);
    return res.status(503).end();
  }
};

module.exports = {
  addNewComment,
  getRecentComments,
  getCommentCount,
};
