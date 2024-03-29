require("dotenv").config({ path: "../.env" });
const express = require("express");
const server = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//Express has to be set up this way in order to work with express on the same port
const httpServer = createServer(server);

server.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://twitter-clone-frontend-27sl.onrender.com"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Cors setup
server.use(
  cors({
    origin: [
      "https://neon-madeleine-1c09fe.netlify.app",
      "https://twitter-clone-frontend-27sl.onrender.com",
    ],
    credentials: true,
  })
);

//socketio seperated logic
const io = new Server(httpServer, {
  cors: {
    origin: [
      "https://neon-madeleine-1c09fe.netlify.app",
      "https://twitter-clone-frontend-27sl.onrender.com",
    ],
    credentials: true,
  },
  cookie: {
    sameSite: "none",
    secure: true,
  },
});
require("./config/socket-io")(io);

//Route imports
const userRoutes = require("./routes/UserRoutes");
const postRoutes = require("./routes/PostRoutes");
const likeRoutes = require("./routes/LikeRoutes");
const commentRoutes = require("./routes/CommentRoutes");
const commentLikeRoutes = require("./routes/CommentLikeRoutes");
const commentRepliesRoutes = require("./routes/CommentRepliesRoutes");
const followRoutes = require("./routes/FollowRoutes");
const conversationRoutes = require("./routes/ConversationRoutes");

//Cookie parser
server.use(cookieParser());

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
server.use("/follow", followRoutes);
server.use("/conversation", conversationRoutes);

httpServer.listen(3001);
