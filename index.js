const http = require("http");
const app = require("./servers/app.js");
const httpServer = http.createServer(app);
const mongoose = require("mongoose");

async function startServer() {
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await httpServer.listen(process.env.PORT);
}

async function stopServer() {
  await httpServer.close();
}

startServer();

return stopServer;
