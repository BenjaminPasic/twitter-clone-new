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
  const userInfo = await decodeJwtToken(req.cookies.token);
  try {
    let recentComments = await dbConnection.query(
      `SELECT c.id, c.written_by_user_id,
            c.written_on_post_id, c.comment, c.createdAt, u.username, 
           (SELECT COUNT(*) FROM commentLikes cl where cl.comment_id = c.id) as total_likes,
           (SELECT COUNT(*) FROM commentReplies cr where cr.written_on_comment_id = c.id) as total_replies
            from comments c
            join users u on c.written_by_user_id = u.id
            where c.written_on_post_id = ${postId}
            ORDER BY c.createdAt DESC
            LIMIT 10 OFFSET ${page}`,
      { type: QueryTypes.SELECT }
    );
    recentComments = recentComments.map((comment) => {
      if (comment.liked_by_user_id === userInfo.user_id) {
        return { ...comment, liked_by_current_user: true };
      } else {
        return { ...comment, liked_by_current_user: false };
      }
    });
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
