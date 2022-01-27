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

suite("authentication server socket", function () {
  this.timeout(30000);

  before(async () => {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });
  before(async () => {
    try {
      await User.deleteOne({ email: "test@test.com" });
      const user = await User.create({
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

  after(async () => {
    await User.deleteOne({ email: "test@test.com" });
    mongoose.disconnect();
    io.close();
    client.close();
  });

  afterEach(() => {
    client.removeAllListeners();
  });

  describe(`socket.on("authenticate", {...})`, () => {
    it("should emit an auth-result message with a token and user details when presented with a valid email and password", function (done) {
      client.on(
        SM.SENT_TO_CLIENT.AUTHENTICATE_RESULT,
        ({ avatar, role, email, _id, token, error }) => {
          expect(error).to.equal(undefined);
          expect(jwt.verify(token, "test@test.com")).to.be.ok;
          expect(avatar).to.equal("placeholder.jpg");
          expect(email).to.equal("test@test.com");
          expect(role).to.equal("Student");
          expect(_id).to.be.ok;
          done();
        }
      );
      client.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
        email: "test@test.com",
        password: "password",
      });
    });
    it("should emit an auth-result message when passed an email but no password", function (done) {
      client.on(
        SM.SENT_TO_CLIENT.AUTHENTICATE_RESULT,
        ({ avatar, role, email, _id, token, error }) => {
          expect(error.details[0].message).to.equal('"password" is required');
          expect(token).to.equal(undefined);
          done();
        }
      );
      client.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
        email: "test@test.com",
      });
    });
    it("should emit an auth-result message when passed a password but no email", function (done) {
      client.on(SM.SENT_TO_CLIENT.AUTHENTICATE_RESULT, ({ token, error }) => {
        expect(error.details[0].message).to.equal('"email" is required');
        expect(token).to.equal(undefined);
        done();
      });
      client.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
        password: "password",
      });
    });
    it("should emit an auth-result message when passed a no email or password", function (done) {
      client.on(SM.SENT_TO_CLIENT.AUTHENTICATE_RESULT, ({ token, error }) => {
        expect(error.details[0].message).to.equal('"email" is required');
        expect(token).to.equal(undefined);
        done();
      });
      client.emit(SM.SENT_FROM_CLIENT.AUTHENTICATE, {
        password: "password",
      });
    });
  });
});
