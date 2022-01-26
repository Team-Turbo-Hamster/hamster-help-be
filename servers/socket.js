const socketio = require("socket.io");

module.exports = (httpServer) => {
  const io = new socketio.Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("============");
    // If you want to immediately trigger something on first connection, add it here
    // e.g. socket.emit("greeting", {greeting: "Hello!"})
    // Add socket.on event listeners here
    // e.g. socket.on("chat message", data => {...})
  });

  return io;
};
