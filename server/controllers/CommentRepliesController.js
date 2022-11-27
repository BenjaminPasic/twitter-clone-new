const CommentReplies = require("../models/CommentReplies");
const { decodeJwtToken } = require("../utils/jwt");

const addNewCommentReply = async (req, res) => {
  const userData = await decodeJwtToken(req.cookies.token);
  try {
    await CommentReplies.create({
      ...req.body,
      written_by_user_id: userData.user_id,
    });
    return res.status(200);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

const getTenRecentComments = async (req, res) => {
  const offset = +req.params.offset;
  const commentId = +req.query["comment_id"];
  try {
    let replies = await CommentReplies.findAll({
      where: {
        written_on_comment_id: commentId,
      },
      limit: 10,
      offset: offset,
      raw: true,
    });
    return res.status(200).json(replies);
  } catch (e) {
    console.log(e);
    return res.status(503);
  }
};

module.exports = {
  addNewCommentReply,
  getTenRecentComments,
};
