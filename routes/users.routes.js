const express = require("express");
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  authenticateUser,
  getUserById,
  getMe,
} = require("../controllers/users.controllers");
const { getTicketByUserId } = require("../controllers/tickets.controllers");
const { isLoggedIn } = require("../middleware/authHttp");

usersRouter.route("/").get(getAllUsers).post(createUser);
usersRouter.route("/me").get(isLoggedIn, getMe, getUserById);
usersRouter.route("/:user_id").get(getUserById);
usersRouter.route("/:user_id/tickets").get(getTicketByUserId);
usersRouter.route("/authenticate").post(authenticateUser);

module.exports = usersRouter;
