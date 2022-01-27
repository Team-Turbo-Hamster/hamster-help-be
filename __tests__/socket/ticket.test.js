const { createServer } = require("http");
const httpServer = createServer();
const { io: Client } = require("socket.io-client");
const io = require("../../servers/socket")(httpServer);
const { suite } = require("mocha");
const { expect } = require("chai");
const User = require("../../models/user.model");
const mongoose = require("mongoose");
const studentClient = new Client("http://localhost:5000");
const tutorClient = new Client("http://localhost:5000");
const SM = require("../../socket-messages");
let student, tutor, studentToken, tutorToken;

suite.only("ticket server socket", function () {
  this.timeout(10000);

  before(async () => {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connected");
  });
  before(async () => {
    try {
      await User.deleteOne({ email: "student@test.com" });
      student = await User.create({
        email: "student@test.com",
        password: "password",
        name: "Test Student",
        avatar: "placeholder.jpg",
        role: "Student",
      });
      console.log(`Student ${student.id} created`);
      await User.deleteOne({ email: "tutor@test.com" });
      tutor = await User.create({
        email: "tutor@test.com",
        password: "password",
        name: "Test Tutor",
        avatar: "placeholder.jpg",
        role: "Tutor",
      });
      console.log(`Tutor ${tutor.id} created`);
    } catch (err) {
      console.log(err);
    }
  });
  before((done) => {
    httpServer.listen(5000, () => {
      console.log("HTTP Server listening");
      done();
    });
  });
  before((done) => {
    studentClient.on("connect", () => {
      console.log("Student Client connected");
      done();
    });
  });
  before((done) => {
    tutorClient.on("connect", () => {
      console.log("Tutor Client connected");
      done();
    });
  });
  before((done) => {
    studentClient.on(SM.SENT_TO_CLIENT.ERROR, (error) => {
      console.log("Student failed to authenticate");
      console.log(error);
      done();
    });
    studentClient.on(SM.SENT_TO_CLIENT.AUTHENTICATED, ({ token }) => {
      console.log("Student authenticated");
      studentToken = token;
      done();
    });
    studentClient.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
      email: student.email,
      password: "password",
    });
  });
  before((done) => {
    tutorClient.on(SM.SENT_TO_CLIENT.ERROR, (error) => {
      console.log("Tutor failed to authenticate");
      console.log(error);
      done();
    });
    tutorClient.on(SM.SENT_TO_CLIENT.AUTHENTICATED, ({ token }) => {
      console.log("Tutor authenticated");
      tutorToken = token;
      done();
    });
    tutorClient.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
      email: tutor.email,
      password: "password",
    });
  });

  after(async () => {
    await User.deleteOne({ email: "student@test.com" });
    await User.deleteOne({ email: "tutor@test.com" });
    mongoose.disconnect();
    io.close();
    studentClient.close();
    tutorClient.close();
  });

  afterEach(() => {
    studentClient.removeAllListeners();
    tutorClient.removeAllListeners();
  });

  describe(`socket.on("new ticket", {...})`, () => {
    it("it should broadcast a new ticket to the authenticated room when passed valid ticket information from a student", function (done) {
      studentClient.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        console.log(error);
        done();
      });
      studentClient.on(
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
      studentClient.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        token: studentToken,
        body: "Valid ticket body",
        title: "Valid ticket title",
        user: student.id,
      });
    });
    it("it should broadcast a new ticket to tutors in the authenticated room when passed valid ticket information from a student", function (done) {
      studentClient.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        console.log(error);
        done();
      });
      tutorClient.on(
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
      studentClient.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        token: studentToken,
        body: "Valid ticket body",
        title: "Valid ticket title",
        user: student.id,
      });
    });
    it("it should send an error to the creator when passed a new ticket with missing user ID", function (done) {
      studentClient.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"user" is required');
        done();
      });
      studentClient.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        token: studentToken,
        body: "Valid ticket body",
        title: "Valid ticket title",
      });
    });
    it("it should send an error to the creator when passed a new ticket with missing ticket body", function (done) {
      studentClient.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"body" is required');
        done();
      });
      studentClient.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        token: studentToken,
        title: "Valid ticket title",
        user: student.id,
      });
    });
    it("it should send an error to the creator when passed a new ticket with missing ticket title", function (done) {
      studentClient.on(SM.SENT_TO_CLIENT.ERROR, ({ error }) => {
        expect(error.details[0].message).to.equal('"title" is required');
        done();
      });
      studentClient.emit(SM.SENT_FROM_CLIENT.NEW_TICKET, {
        token: studentToken,
        body: "Valid ticket body",
        user: student.id,
      });
    });
  });
});
