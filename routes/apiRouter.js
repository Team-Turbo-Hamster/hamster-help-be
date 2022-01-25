const express = require("express");
const usersRouter = require("./users.routes");
const ticketsRouter = require("./tickets.routes");
const apiRouter = express.Router();

// Routers for each route here
apiRouter.use("/users", usersRouter);
apiRouter.use("/tickets", ticketsRouter);

module.exports = apiRouter;
