const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  getUserById,
} = require("../controllers/users.controllers");

usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.route("/:user_id").get(getUserById);

module.exports = usersRouter;
