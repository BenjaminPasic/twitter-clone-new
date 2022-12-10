const dbConnection = require("../config/dbConnection");
const { DataTypes } = require("sequelize");

const User = dbConnection.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
});

(async () => {
  try {
    await User.sync();
    console.log("User sync complete");
  } catch (error) {
    console.log("Sync error: ", error);
  }
})();

module.exports = User;
