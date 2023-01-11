const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const Conversation = dbConnection.define("conversation", {
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    default: null,
  },
});

(async () => {
  try {
    await Conversation.sync({ alter: true });
    console.log("Conversation sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = Conversation;
