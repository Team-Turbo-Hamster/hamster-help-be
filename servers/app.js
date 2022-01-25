const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const apiRouter = require("../routes/apiRouter");
const { handleCustomErrors, handleServerErrors } = require("../errors");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.DATABASE,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error(error);
});

const sessionMiddleware = session({
  secret: uuidv4(),
  resave: true,
  saveUninitialized: true,
  store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(sessionMiddleware);
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not Found" }));
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = { app, sessionMiddleware };
