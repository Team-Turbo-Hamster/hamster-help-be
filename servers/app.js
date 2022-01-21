const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const morgan = require("morgan");
const apiRouter = require("../routes/apiRouter");
const { handleCustomErrors, handleServerErrors } = require("../errors");
const sessionMiddleware = session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: false,
});
app.use(morgan("combined"));
app.use(cors());
app.use(sessionMiddleware);
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not Found" }));
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app, sessionMiddleware };
