const express = require("express");
const usersRouter = require("./users.routes");
const apiRouter = express.Router();

// Routers for each route here
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
