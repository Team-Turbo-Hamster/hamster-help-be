const { createServer } = require("http");
const httpServer = createServer();
const { io: Client } = require("socket.io-client");
const io = require("../../servers/socket")(httpServer);
const { suite } = require("mocha");
const { expect } = require("chai");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const jwt = require("../../api/jwt");
const client = new Client("http://localhost:5000");
const SM = require("../../socket-messages");
let user, userToken;

suite.only("ticket server socket", function () {
  this.timeout(10000);

  before(async () => {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  before(async () => {
    try {
      await User.deleteOne({ email: "test@test.com" });
      user = await User.create({
        email: "test@test.com",
        password: "password",
        name: "Test",
        avatar: "placeholder.jpg",
        role: "Student",
      });
    } catch (err) {
      console.log(err);
    }
  });
  before((done) => {
    httpServer.listen(5000, () => {
      client.on("connect", () => {
        console.log("Server connected to client");
        done();
      });
    });
  });
  before((done) => {
    client.on(SM.SENT_TO_CLIENT.ERROR, (error) => {
      console.log("Test User failed to authenticate");
      console.log(error);
      done();
    });
    client.on(SM.SENT_TO_CLIENT.AUTHENTICATED, ({ token }) => {
      console.log("Test User authenticated");
      userToken = token;
      done();
    });
    client.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
      email: user.email,
      password: "password",
    });
  });

  after(async () => {
    await User.deleteOne({ email: "test@test.com" });
    mongoose.disconnect();
    io.close();
    client.close();
  });

  afterEach(() => {
    client.removeAllListeners();
  });

  describe(`socket.on("new ticket", {...})`, () => {
    it("it should broadcast a new ticket to the authenticated room when passed valid ticket information", function (done) {
      client.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        console.log(error);
        done();
      });
      client.on(
        SM.SENT_TO_CLIENT.NEW_TICKET,
        ({ ticket: { title, user, body, created_at, id } }) => {
          expect(title).to.equal("Valid ticket title");
          expect(body).to.equal("Valid ticket body");
          expect(user).to.be.a("string");
          expect(created_at).to.be.a("string");
          expect(id).to.be.a("string");
          done();
        }
      );
      client.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        body: "Valid ticket body",
        title: "Valid ticket title",
        user: user.id,
      });
    });
    it("it should send an error to the creator when passed a new ticket with missing user ID", function (done) {
      client.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"user" is required');
        done();
      });
      client.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        body: "Valid ticket body",
        title: "Valid ticket title",
      });
    });
    it("it should send an error to the creator when passed a new ticket with missing ticket body", function (done) {
      client.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"body" is required');
        done();
      });
      client.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        title: "Valid ticket title",
        user: user.id,
      });
    });
    it("it should send an error to the creato when passed a new ticket with missing ticket title", function (done) {
      client.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"title" is required');
        done();
      });
      client.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        body: "Valid ticket body",
        user: user.id,
      });
    });
  });
});
