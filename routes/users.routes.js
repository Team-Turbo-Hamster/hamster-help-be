const express = require("express");
const usersRouter = express.Router();
const { getAllUsers, createUser } = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(createUser);

module.exports = usersRouter;
