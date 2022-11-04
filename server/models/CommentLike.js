const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const CommentLike = dbConnection.define("commentLike", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
  try {
    await CommentLike.sync();
    console.log("Comment Likes sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = CommentLike;
