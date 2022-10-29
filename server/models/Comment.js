const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Comment = dbConnection.define("comment", {
  written_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  written_on_post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

(async () => {
  try {
    await Comment.sync();
    console.log("Comment sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Comment;
