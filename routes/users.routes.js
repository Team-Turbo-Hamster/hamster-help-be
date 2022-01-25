const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  authenticateUser,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.post("/authenticate", authenticateUser);

module.exports = usersRouter;
