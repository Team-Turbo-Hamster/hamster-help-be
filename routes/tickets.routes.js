const express = require("express");
const ticketRouter = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
} = require("../controllers/tickets.controllers");

ticketRouter.route("/").get(getAllTickets).post(createTicket);
ticketRouter.route("/:ticket_id").get(getTicketById);

module.exports = ticketRouter;
