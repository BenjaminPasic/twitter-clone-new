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
    console.log(lastComment);
    res
      .status(200)
      .json({ ...lastComment, username: userData.username })
      .end();
  } catch (e) {
    res.status(503).end();
  }
};

const getRecentComments = async (req, res) => {
  const { page } = req.params;
  const postId = req.query["post_id"];

  try {
    const recentComments = await dbConnection.query(
      `SELECT c.id, c.written_by_user_id, c.written_on_post_id,
          c.comment, u.username, u.createdAt
          FROM comments c
          JOIN users u on c.written_by_user_id = u.id
          HAVING written_on_post_id = ${postId}
          ORDER BY c.createdAt DESC
          LIMIT 10 OFFSET ${page}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ recentComments }).end();
  } catch (e) {
    console.log(e);
    res.status(503).end();
  }
};

module.exports = {
  addNewComment,
  getRecentComments,
};
