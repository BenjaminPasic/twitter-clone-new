const express = require("express");
const server = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Route imports
const userRoutes = require("./routes/UserRoutes");
const postRoutes = require("./routes/PostRoutes");
const likeRoutes = require("./routes/LikeRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const commentLikeRoutes = require("./routes/CommentLikeRoutes");
const commentRepliesRoutes = require("./routes/CommentRepliesRoutes");

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
server.use("/like", likeRoutes);
server.use("/comment", commentRoutes);
server.use("/commentlike", commentLikeRoutes);
server.use("/commentreply", commentRepliesRoutes);

server.listen(3001);
