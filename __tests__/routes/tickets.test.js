// const { suite, describe, it } = require("mocha");
// const expect = require("chai").expect;
// const assert = require("chai").assert;
// const request = require("supertest");
// const app = require("../../servers/app");
// const runSeed = require("../../db/seeds/seed");
// const mongoose = require("mongoose");

// suite("/api/tickets", function () {
//   this.timeout(30000);

//   before(function (done) {
//     runSeed()
//       .then(() => {
//         done();
//       })
//       .catch((err) => {
//         done(err);
//       });
//   });

//   after(function () {
//     mongoose.disconnect();
//   });

//   describe("GET /api/tickets", () => {
//     it(" 200: should respond with an array of tickets", async () => {
//       const {
//         body: { tickets },
//       } = await request(app).get("/api/tickets").expect(200);

//       expect(Array.isArray(tickets)).to.equal(true);
//       expect(tickets).to.have.lengthOf.above(0);
//       tickets.forEach((ticket) => {
//         expect(ticket).to.have.property("title");
//         expect(ticket).to.have.property("user");
//         expect(ticket).to.have.property("body");
//         expect(ticket).to.have.property("tags");
//         expect(ticket).to.have.property("images");
//         expect(ticket).to.have.property("created_at");
//         expect(ticket).to.have.property("resolved");
//       });
//     });
//   });

//   describe("GET /api/tickets/:ticket_id", () => {
//     it(" 200: get a ticket by id", async () => {
//       //I need to query for all tickets first to get a valid ID
//       const {
//         body: { tickets },
//       } = await request(app).get("/api/tickets").expect(200);

//       const {
//         body: { ticket },
//       } = await request(app).get(`/api/tickets/${tickets[0]._id}`).expect(200);

//       expect(ticket).to.have.property("title");
//       expect(ticket).to.have.property("user");
//       expect(ticket).to.have.property("body");
//       expect(ticket).to.have.property("tags");
//       expect(ticket).to.have.property("images");
//       expect(ticket).to.have.property("created_at");
//       expect(ticket).to.have.property("resolved");
//     });

//     it(" 400: get a ticket by id not found", async () => {
//       const {
//         body: { msg },
//       } = await request(app)
//         .get(`/api/tickets/23455yhgf343ss565tgfr`)
//         .expect(400);

//       expect(msg).to.have.string("Invalid _id: 23455yhgf343ss565tgfr");
//     });
//   });

//   describe("POST /api/tickets", () => {
//     it("201: should create and respond with the ticket created", async () => {
//       const ticketBody = {
//         title: "Ticket Tittleasdsadaaaaa",
//         body: "bodyyyyyyssss",
//       };

//       const {
//         body: { ticket },
//       } = await request(app).post("/api/tickets").send(ticketBody).expect(201);

//       expect(ticket).to.have.property("title");
//       expect(ticket).to.have.property("user");
//       expect(ticket).to.have.property("body");
//       expect(ticket).to.have.property("tags");
//       expect(ticket.tags).to.be.instanceof(Array);
//       expect(ticket).to.have.property("images");
//       expect(ticket.images).to.be.instanceof(Array);
//       expect(ticket).to.have.property("created_at");
//       expect(ticket).to.have.property("resolved");
//       expect(ticket.resolved).to.be.false;
//     });

//     it("POST - 400: if any fields are missing on creation", async () => {
//       const ticketBody = {
//         title: "Ticket Tittleasdsadaaaaa",
//       };

//       const {
//         body: { msg },
//       } = await request(app).post("/api/tickets").send(ticketBody).expect(400);

//       expect(msg).to.have.string("Ticket fields missing");
//     });
//   });

//   describe("GET /api/users/:user_id/tickets", () => {
//     it("200: get a tickets by USER id", async () => {
//       //I need to query for all users first to get a valid ID
//       const {
//         body: { users },
//       } = await request(app).get(`/api/users`).expect(200);

//       const {
//         body: { tickets },
//       } = await request(app)
//         .get(`/api/users/${users[0]._id}/tickets`)
//         .expect(200);

//       assert.isArray(tickets);
//     });

//     it("GET - 400: get a tickets by invalid USER id", async () => {
//       await request(app).get(`/api/users/3456ygfdsd/tickets`).expect(400);
//     });
//   });

//   describe("PATCH /api/tickets/:ticket_id", () => {
//     it(" 200: update a ticket", async () => {
//       //I need to query for all tickets first to get a valid ID
//       const {
//         body: { tickets },
//       } = await request(app).get(`/api/tickets`).expect(200);

//       const updatedTicket = {
//         title: "This is a new title",
//         body: "new body",
//       };
//       const {
//         body: { ticket },
//       } = await request(app)
//         .patch(`/api/tickets/${tickets[0]._id}`)
//         .send(updatedTicket)
//         .expect(200);

//       expect(ticket.title).to.have.string(updatedTicket.title);
//       expect(ticket.body).to.have.string(updatedTicket.body);
//     });

//     it("400: when updating ticket with missing fields", async () => {
//       const {
//         body: { tickets },
//       } = await request(app).get(`/api/tickets`).expect(200);

//       const updatedTicket = {
//         title: "This is a new title",
//       };
//       const { body } = await request(app)
//         .patch(`/api/tickets/${tickets[0]._id}`)
//         .send(updatedTicket)
//         .expect(400);

//       expect(body.msg).to.have.string("Ticket fields missing");
//     });
//   });

//   describe("DELETE /api/tickets/:ticket_id", () => {
//     it("204: when deleting a ticket", async () => {
//       const {
//         body: { tickets },
//       } = await request(app).get(`/api/tickets`).expect(200);

//       const ticketId = tickets[0]._id;

//       await request(app).delete(`/api/tickets/${ticketId}`).expect(204);

//       const {
//         body: { msg },
//       } = await request(app).get(`/api/tickets/${ticketId}`).expect(404);

//       expect(msg).to.have.string("Not Found");
//     });

//     //TODO: test for attempt of another user trying to delete
//   });

//   describe("PATCH /api/tickets/:ticket_id/resolve", () => {
//     it("200: when resolving a ticket", async () => {
//       const {
//         body: { tickets },
//       } = await request(app).get(`/api/tickets`).expect(200);

//       const ticketId = tickets[1]._id;
//       const {
//         body: { ticket },
//       } = await request(app)
//         .patch(`/api/tickets/${ticketId}/resolve`)
//         .expect(200);

//       assert.isTrue(ticket.resolved);
//     });
//   });

//   describe("PATCH /api/tickets/:ticket_id/unresolve", () => {
//     it("200: when unResolving a ticket", async () => {
//       const {
//         body: { tickets },
//       } = await request(app).get(`/api/tickets`).expect(200);

//       const ticketId = tickets[1]._id;
//       const {
//         body: { ticket },
//       } = await request(app)
//         .patch(`/api/tickets/${ticketId}/unresolve`)
//         .expect(200);

//       assert.isFalse(ticket.resolved);
//     });
//   });
// });
