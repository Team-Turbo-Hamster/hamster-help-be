const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  authenticateUser,
  getUserById,
} = require("../controllers/users.controllers");
const { getTicketByUserId } = require("../controllers/tickets.controllers");

usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.route("/:user_id").get(getUserById);
usersRouter.route("/:user_id/tickets").get(getTicketByUserId);
usersRouter.route("/authenticate").post(authenticateUser);

module.exports = usersRouter;
