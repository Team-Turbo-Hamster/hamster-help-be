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
  getAllTicketsByTag,
  getAllTicketsUnresolved,
  getAllTicketsResolved,
} = require("../controllers/tickets.controllers");
const authHttp = require("../middleware/authHttp");

ticketRouter
  .route("/")
  .get(getAllTickets)
  .post(authHttp.isStudent, createTicket);

ticketRouter.route("/resolved").get(getAllTicketsResolved);
ticketRouter.route("/unresolved").get(getAllTicketsUnresolved);

ticketRouter
  .route("/:ticket_id")
  .get(getTicketById)
  .patch(updateTicket)
  .delete(authHttp.isTutor, removeTicket);

ticketRouter.route("/tag/:tag_name").get(getAllTicketsByTag);

ticketRouter
  .route("/:ticket_id/resolve")
  .patch(authHttp.isTutor, resolveTicket);
ticketRouter
  .route("/:ticket_id/unresolve")
  .patch(authHttp.isTutor, unResolveTicket);

module.exports = ticketRouter;
