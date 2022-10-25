const Post = require("../models/Post");
const dbConnection = require("../config/dbConnection");
const { decodeJwtToken } = require("../utils/jwt");
const { QueryTypes } = require("sequelize");

const addNewPost = async (req, res) => {
  try {
    const decodedToken = await decodeJwtToken(req.cookies.token);
    console.log(decodedToken);
    await Post.create({
      post: req.body.post,
      user_id: decodedToken.user_id,
    });
    res.status(200).json({ username: decodedToken.username }).end();
  } catch (error) {
    console.log(error);
    res.status(301).json(error).end();
  }
};

const getRecentPosts = async (req, res) => {
  const { page } = req.params;

  let offset = 0;
  if (page > 1) {
    offset = page * 10 - 10;
  }
  try {
    const recentPosts = await dbConnection.query(
      `SELECT p.id AS post_id, u.id AS user_id,
            p.post, p.createdAt, u.username
            FROM posts p
            JOIN users u on p.user_id = u.id
            ORDER BY p.createdAt DESC
            LIMIT 10 OFFSET ${offset}`,
      { type: QueryTypes.SELECT }
    );
    res.status(200).json({ recentPosts }).end();
  } catch (e) {
    console.log(e);
    res.status(503).json({ error: "server error" }).end();
  }
};

module.exports = {
  addNewPost,
  getRecentPosts,
};
