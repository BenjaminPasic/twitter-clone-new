const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Conversation = dbConnection.define("conversation", {
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

(async () => {
  try {
    await Conversation.sync();
    console.log("Conversation sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Conversation;
