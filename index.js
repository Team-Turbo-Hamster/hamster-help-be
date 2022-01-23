const http = require("http");
const { app, sessionMiddleware } = require("./servers/app.js");
const httpServer = http.createServer(app);
const passport = require("passport");
const mongoose = require("mongoose");
const io = require("./servers/socket.js")(
  httpServer,
  sessionMiddleware,
  passport
);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Express and Socket.io server running on port ${process.env.PORT}`
  );
});
