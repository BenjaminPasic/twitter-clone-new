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
    return res.status(200).json({ username: decodedToken.username }).end();
  } catch (error) {
    console.log(error);
    return res.status(301).json(error).end();
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
      `SELECT p.id AS post_id,
            u.id AS user_id,
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
      let editedPost = { ...post };
      if (post.liked_by_user_id === currentUserId) {
        editedPost = { ...editedPost, liked_by_current_user: true };
      }
      if (post.user_id === currentUserId) {
        editedPost = { ...editedPost, created_by_current_user: true };
        return editedPost;
      }
      return editedPost;
    });
    res.status(200).json({ recentPosts }).end();
  } catch (e) {
    res.status(503).json({ error: "server error" }).end();
  }
};

const deletePost = async (req, res) => {
  const { user_id: currentUserId } = await decodeJwtToken(req.cookies.token);
  let { post_id: postId, user_id: userId } = req.query;
  postId = +postId;
  userId = +userId;
  if (currentUserId === userId) {
    try {
      await Post.destroy({
        where: {
          id: postId,
        },
      });
      return res.status(200).json(postId).end();
    } catch (e) {
      console.log(e);
      return res.status(503).end();
    }
  }
};

const editPost = async (req, res) => {
  const { user_id: currentUserId } = await decodeJwtToken(req.cookies.token);
  let { post_id, user_id, editInput: newPost } = req.body;
  if (currentUserId === user_id) {
    try {
      await Post.update({ post: newPost }, { where: { id: post_id } });
      return res.status(200).end();
    } catch (e) {
      console.log(e);
      return res.status(503).end();
    }
  }
};

module.exports = {
  addNewPost,
  getRecentPosts,
  deletePost,
  editPost,
};
