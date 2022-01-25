const socketio = require("socket.io");

module.exports = (httpServer, sessionMiddleware, passport) => {
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  const io = new socketio.Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // If you want to immediately trigger something on first connection, add it here
    // e.g. socket.emit("greeting", {greeting: "Hello!"})
    // Add socket.on event listeners here
    // e.g. socket.on("chat message", data => {...})
  });

  return io;
};
