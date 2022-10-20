const Like = require("../models/Like");
const { decodeJwtToken } = require("../utils/jwt");

const deleteExistingLike = async (postId, userId) => {
  try {
    await Like.destroy({
      where: {
        post_id: postId,
        user_id: userId,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

const addNewLike = async (req, res) => {
  const postInfo = req.body;
  const userInfo = await decodeJwtToken(req.cookies.token);

  const post = await Like.count({
    where: {
      post_id: postInfo.post_id,
      user_id: userInfo.user_id,
    },
    raw: true,
  });

  if (post) {
    try {
      await deleteExistingLike(postInfo.post_id, userInfo.user_id);
      res.status(200).end();
    } catch (e) {
      res.status(503).json({ error: "error" }).end();
      console.log(e);
    }
  } else {
    try {
      await Like.create({
        user_id: userInfo.user_id,
        post_id: postInfo.post_id,
      });
      res.status(200).json({ isSuccess: true }).end();
    } catch (e) {
      console.log(e);
      res.status(503).json({ error: "server error" }).end();
    }
  }
};

module.exports = {
  addNewLike,
};
