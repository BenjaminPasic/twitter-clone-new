const Post = require("../models/Post");
const dbConnection = require("../config/dbConnection");
const { decodeJwtToken } = require("../utils/jwt");
const { QueryTypes } = require("sequelize");

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
    const recentPosts = await dbConnection.query(
      "select * from posts\n" +
        "join users u on u.id = posts.user_id\n" +
        "order by posts.createdAt DESC limit 10",
      { type: QueryTypes.SELECT }
    );
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
