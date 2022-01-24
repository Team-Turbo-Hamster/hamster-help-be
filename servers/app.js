const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const morgan = require("morgan");
const apiRouter = require("../routes/apiRouter");
// const { handleCustomErrors, handleServerErrors } = require("../errors");
const globalErrorHandler = require("../controllers/error.controllers");
const AppError = require("../utils/appError");
const sessionMiddleware = session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: false,
});
app.use(morgan("combined"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(sessionMiddleware);
app.use("/api", apiRouter);
// app.use("", (req, res, next) => next({ status: 404, msg: "Not Found" }));
// app.use(handleCustomErrors);
// app.use(handleServerErrors);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = { app, sessionMiddleware };
