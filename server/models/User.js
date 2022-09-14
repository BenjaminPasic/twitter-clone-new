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
});

dbConnection
  .sync()
  .then(() => {
    console.log("User db model sync complete");
  })
  .catch((error) => {
    console.log("DB model sync error: ", error);
  });

module.exports = User;