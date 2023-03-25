const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "../.env" });

// const dbConnection = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql",
//     logging: false,
//   }
// );

const dbConnection = new Sequelize('mysql://root:ivKRTJ7CUFMglBkDJkT9@containers-us-west-190.railway.app:5925/railway')

dbConnection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.log("FAILURE! connection to database has failed.");
    console.log("here", error);
  });

module.exports = dbConnection;
