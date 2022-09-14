const express = require("express");
const server = express();
const morgan = require("morgan");

//Database connection
const dbConnection = require("./config/dbConnection");

//Logger for requests
app.use(morgan("tiny"));

server.listen(3001);
