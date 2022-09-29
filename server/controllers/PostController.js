const Post = require("../models/Post");
const { decodeJwtToken, verifyJwtToken } = require("../utils/jwt");

const addNewPost = async (req, res) => {
  try {
    const decodedToken = await decodeJwtToken(req.cookies.token);
    await Post.create({ post: req.body.post, user_id: decodedToken.user_id });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addNewPost,
};
