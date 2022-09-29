const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Route imports
const userRoutes = require("./routes/UserRoutes");
const postRoutes = require("./routes/PostRoutes");

//Cookie parser
server.use(cookieParser());

//Cors setup
server.use(cors({ origin: "http://localhost:3000", credentials: true }));

//Logger for requests
server.use(morgan("tiny"));

//Parsers for json and url encoding
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Include routes
server.use("/user", userRoutes);
server.use("/post", postRoutes);

server.listen(3001);
