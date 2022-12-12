const Post = require("../models/Post");
const dbConnection = require("../config/dbConnection");
const { decodeJwtToken } = require("../utils/jwt");
const { QueryTypes } = require("sequelize");

const addNewPost = async (req, res) => {
  const decodedToken = await decodeJwtToken(req.cookies.token);
  try {
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
    const { user_id: currentUserId } = await decodeJwtToken(req.cookies.token);
    let recentPosts = await dbConnection.query(
      `SELECT p.id AS post_id, u.id AS user_id,
            p.post, p.createdAt, u.username,
            l.user_id as liked_by_user_id,
            count(l.user_id) as total_likes,
            count(c.comment) as total_comments
            FROM posts p
            JOIN users u on p.user_id = u.id
            LEFT JOIN likes l ON l.post_id = p.id
            LEFT JOIN comments c on c.written_on_post_id = p.id
            GROUP BY p.id, l.user_id
            ORDER BY p.createdAt DESC
            LIMIT 10 OFFSET ${offset}`,
      { type: QueryTypes.SELECT }
    );
    //Check if current user liked the post, so we can show it accordingly in the frontend
    recentPosts = recentPosts.map((post) => {
      if (post.liked_by_user_id === currentUserId) {
        return { ...post, liked_by_current_user: true };
      }
      return { ...post, liked_by_current_user: false };
    });
    res.status(200).json({ recentPosts }).end();
  } catch (e) {
    res.status(503).json({ error: "server error" }).end();
  }
};

module.exports = {
  addNewPost,
  getRecentPosts,
};
