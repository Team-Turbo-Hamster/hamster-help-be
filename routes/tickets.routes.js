const express = require("express");
const ticketRouter = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  removeTicket,
} = require("../controllers/tickets.controllers");

ticketRouter.route("/").get(getAllTickets).post(createTicket);
ticketRouter
  .route("/:ticket_id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(removeTicket);

module.exports = ticketRouter;
