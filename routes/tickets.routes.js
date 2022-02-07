const express = require("express");
const {
  createComment,
  removeComment,
} = require("../controllers/comments.controllers");
const ticketRouter = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  removeTicket,
  getAllTicketsByTag,
  getAllTicketsUnresolved,
  getAllTicketsResolved,
} = require("../controllers/tickets.controllers");
const { getMe } = require("../controllers/users.controllers");
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

module.exports = ticketRouter;
