const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");

//Database connection
const dbConnection = require("./config/dbConnection");

//Cors setup
server.use(cors({ origin: "http://localhost:3000" }));

//Logger for requests
server.use(morgan("tiny"));

server.listen(3001);
