const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Post = dbConnection.define("post", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  post: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  old_post: {
    type: DataTypes.STRING,
    defaultValue: null,
    allowNull: true,
  },
});

(async () => {
  try {
    await Post.sync();
    console.log("Post sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Post;
