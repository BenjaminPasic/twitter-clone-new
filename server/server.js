require("dotenv").config({ path: "../.env" });
const cors = require("cors");

const express = require("express");
const server = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");


//Express has to be set up this way in order to work with express on the same port
const httpServer = createServer(server);

//Cors setup
server.use(cors({ origin: "https://main--neon-madeleine-1c09fe.netlify.app", credentials: true }));

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

//socketio seperated logic
const io = new Server(httpServer, {
  cors: {
    origin: "https://main--neon-madeleine-1c09fe.netlify.app",
    credentials: true,
  },
  cookie: true,
});

require("./config/socket-io")(io);

httpServer.listen(3001);
