const Comment = require("../models/Comment");
const { decodeJwtToken } = require("../utils/jwt");

const addNewComment = async (req, res) => {
  const { post_id, comment } = req.body;
  const userData = await decodeJwtToken(req.cookies.token);
  await Comment.create({
    written_by_user_id: userData.user_id,
    written_on_post_id: post_id,
    comment: comment,
  });
};

module.exports = {
  addNewComment,
};
