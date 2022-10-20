const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Like = dbConnection.define("like", {
  user_id: {
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
    await Like.sync();
    console.log("Like sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Like;
