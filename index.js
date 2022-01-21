const http = require("http");
const { app, sessionMiddleware } = require("./servers/app.js");
const httpServer = http.createServer(app);
const passport = require("passport");
const io = require("./servers/socket.js")(
  httpServer,
  sessionMiddleware,
  passport
);

require("dotenv").config({
  path: `./env/.env.${process.env.NODE_ENV}`,
  debug: true,
});

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Express and Socket.io server running on port ${process.env.PORT}`
  );
});
