const socketEventsInit = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (room) => {
      socket.join(room);
    });

    socket.on("send-message", (message, room) => {
      socket.to(room).emit("receive-message", message);
    });
  });
};

module.exports = socketEventsInit;
