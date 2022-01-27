const http = require("http");
const app = require("./servers/app.js");
const httpServer = http.createServer(app);
const io = require("./servers/socket.js")(httpServer);
const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful");
  });

// io.on("connection", (socket) => {
//   app.use((req, res, next) => {
//     req.soServer = socket;
//     next();
//   });
// });

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Express and Socket.io server running on port ${process.env.PORT}`
  );
});
