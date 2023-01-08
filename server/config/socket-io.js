const socketEventsInit = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on("send-message", (message) => {
      socket.broadcast.emit("receive-message", message);
    });
  });
};

module.exports = socketEventsInit;
