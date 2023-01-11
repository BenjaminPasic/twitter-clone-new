const { decodeJwtToken } = require("../utils/jwt");
const cookieParser = require("socket.io-cookie-parser");
const Conversation = require("../models/Conversation");

const socketEventsInit = (io) => {
  io.use(cookieParser());
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("send-message", async (message, room, receiverId) => {
      const senderData = await decodeJwtToken(socket.request.cookies.token);
      socket.to(room).emit("receive-message", message);
      try {
        await Conversation.create({
          sender_id: senderData.user_id,
          receiver_id: receiverId,
          message,
          room_id: room,
        });
      } catch (e) {
        console.log(e);
      }
    });
  });
};

module.exports = socketEventsInit;
