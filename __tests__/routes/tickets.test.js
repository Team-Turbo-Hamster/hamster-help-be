if (!process.env.REMOTE_TEST) {
  require("../../environment/test");
}
const expect = require("chai").expect;
const assert = require("chai").assert;
const request = require("supertest");
const { app } = require("../../servers/app");
const runSeed = require("../../db/seeds/seed");
const mongoose = require("mongoose");

describe("/api/tickets", function () {
  this.timeout(30000);

  before(function (done) {
    runSeed()
      .then(() => {
        done();
      })
      .catch((err) => {
        console.error(err);
      });
  });

  after(function () {
    mongoose.disconnect();
  });

  it("GET - 200: should respond with an array of tickets", async () => {
    const {
      body: { tickets },
    } = await request(app).get("/api/tickets").expect(200);

    expect(Array.isArray(tickets)).to.equal(true);
    expect(tickets).to.have.lengthOf.above(0);
    tickets.forEach((ticket) => {
      expect(ticket).to.have.property("title");
      expect(ticket).to.have.property("user");
      expect(ticket).to.have.property("body");
      expect(ticket).to.have.property("tags");
      expect(ticket).to.have.property("images");
      expect(ticket).to.have.property("created_at");
      expect(ticket).to.have.property("resolved");
    });
  }).timeout(30000);

  it("GET - 200: get a ticket by id", async () => {
    //I need to query for all tickets first to get a valid ID
    const {
      body: { tickets },
    } = await request(app).get("/api/tickets").expect(200);

    const {
      body: { ticket },
    } = await request(app).get(`/api/tickets/${tickets[0]._id}`).expect(200);

    expect(ticket).to.have.property("title");
    expect(ticket).to.have.property("user");
    expect(ticket).to.have.property("body");
    expect(ticket).to.have.property("tags");
    expect(ticket).to.have.property("images");
    expect(ticket).to.have.property("created_at");
    expect(ticket).to.have.property("resolved");
  }).timeout(30000);

  it("GET - 400: get a ticket by id not found", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get(`/api/tickets/23455yhgf343ss565tgfr`)
      .expect(400);

    expect(msg).to.have.string("Invalid _id: 23455yhgf343ss565tgfr");
  }).timeout(30000);

  it("POST - 201: should create and respond with the ticket created", async () => {
    const ticketBody = {
      title: "Ticket Tittleasdsadaaaaa",
      body: "bodyyyyyyssss",
    };

    const {
      body: { ticket },
    } = await request(app).post("/api/tickets").send(ticketBody).expect(201);

    expect(ticket).to.have.property("title");
    expect(ticket).to.have.property("user");
    expect(ticket).to.have.property("body");
    expect(ticket).to.have.property("tags");
    expect(ticket.tags).to.be.instanceof(Array);
    expect(ticket).to.have.property("images");
    expect(ticket.images).to.be.instanceof(Array);
    expect(ticket).to.have.property("created_at");
    expect(ticket).to.have.property("resolved");
    expect(ticket.resolved).to.be.false;
  }).timeout(30000);

  it("POST - 400: if any fields are missing on creation", async () => {
    const ticketBody = {
      title: "Ticket Tittleasdsadaaaaa",
    };

    const {
      body: { msg },
    } = await request(app).post("/api/tickets").send(ticketBody).expect(400);

    expect(msg).to.have.string("Ticket fields missing");
  }).timeout(30000);

  it("GET - 200: get a tickets by USER id", async () => {
    //I need to query for all tickets first to get a valid ID
    const {
      body: { users },
    } = await request(app).get(`/api/users`).expect(200);

    const {
      body: { tickets },
    } = await request(app)
      .get(`/api/users/${users[0]._id}/tickets`)
      .expect(200);

    assert.isArray(tickets);
  }).timeout(30000);

  it("GET - 400: get a tickets by invalid USER id", async () => {
    await request(app).get(`/api/users/3456ygfdsd/tickets`).expect(400);
  }).timeout(30000);
});
