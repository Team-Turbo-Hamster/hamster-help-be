const express = require("express");
const userRouter = express.Router();
const {
  createTicket,
  getAllTickets,
} = require("../controllers/tickets.controllers");

userRouter.route("/").get(getAllTickets).post(createTicket);

module.exports = userRouter;
