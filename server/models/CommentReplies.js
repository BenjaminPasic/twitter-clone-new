const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const CommentReplies = dbConnection.define("commentReplies", {
  written_by_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  written_on_comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reply: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
});

(async () => {
  try {
    await CommentReplies.sync();
    console.log("Comment replies sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = CommentReplies;
