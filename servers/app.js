const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("../routes/apiRouter");
const { handleCustomErrors, handleServerErrors } = require("../errors");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not Found" }));
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
