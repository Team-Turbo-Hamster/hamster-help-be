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
const authHttp = require("../middleware/authHttp");

ticketRouter
  .route("/")
  .get(getAllTickets)
  .post(authHttp.isStudent, createTicket);
ticketRouter
  .route("/:ticket_id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(removeTicket);

ticketRouter.route("/:ticket_id/resolve").patch(resolveTicket);
ticketRouter.route("/:ticket_id/unresolve").patch(unResolveTicket);

module.exports = ticketRouter;
