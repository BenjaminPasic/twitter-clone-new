const Post = require("../models/Post");
const { decodeJwtToken } = require("../utils/jwt");

const addNewPost = async (req, res) => {
  try {
    const decodedToken = await decodeJwtToken(req.cookies.token);
    await Post.create({ post: req.body.post, user_id: decodedToken.user_id });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(301).json(error).end();
  }
};

const getRecentPosts = async (req, res) => {
  try {
    //Join user to get useranme TODOOO
    const recentPosts = await Post.findAll({
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    res.status(200).json({ recentPosts }).end();
  } catch (e) {
    console.log(e);
    res.status(503).json({ error: "" }).end();
  }
};

module.exports = {
  addNewPost,
  getRecentPosts,
};
