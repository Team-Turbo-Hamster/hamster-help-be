const http = require("http");
const app = require("./app.js");
const httpServer = http.createServer(app);
const io = require("./socket.js")(httpServer);

require("dotenv").config({
  path: `./env/.env.${process.env.NODE_ENV}`,
  debug: true,
});

httpServer.listen(process.env.PORT, () => {
  console.log(
    `Express and Socket.io server running on port ${process.env.PORT}`
  );
});
