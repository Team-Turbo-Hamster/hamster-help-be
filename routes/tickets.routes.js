const express = require("express");
const ticketRouter = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  removeTicket,
  resolveTicket,
  unResolveTicket,
} = require("../controllers/tickets.controllers");

ticketRouter.route("/").get(getAllTickets).post(createTicket);
ticketRouter
  .route("/:ticket_id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(removeTicket);

ticketRouter.route("/:ticket_id/resolve").patch(resolveTicket);
ticketRouter.route("/:ticket_id/unresolve").patch(unResolveTicket);

module.exports = ticketRouter;
