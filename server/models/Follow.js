const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Follow = dbConnection.define("follow", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  follows_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
  try {
    await Follow.sync();
    console.log("Follow sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Follow;
