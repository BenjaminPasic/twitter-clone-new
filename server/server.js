const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");

//Database connection
const dbConnection = require("./config/dbConnection");

//Route imports
const userRoutes = require("./routes/UserRoutes");

//Cors setup
server.use(cors({ origin: "http://localhost:3000" }));

//Logger for requests
server.use(morgan("tiny"));

//Parsers for json and url encoding
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Include routes
server.use("/user", userRoutes);

server.listen(3001);
