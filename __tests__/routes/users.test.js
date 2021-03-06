const { suite, describe, it } = require("mocha");
const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../servers/app");
const runSeed = require("../../db/seeds/seed");
const mongoose = require("mongoose");
const User = require("../../models/user.model");

suite("users routes", function () {
  this.timeout(30000);

  before((done) => {
    runSeed()
      .then(() => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  after((done) => {
    User.deleteMany({ username: { $in: ["testStudent1", "testStudent2"] } });
    mongoose.disconnect();
    done();
  });

  describe("GET /api/users", function () {
    it("should respond with an array of users", async () => {
      await request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(Array.isArray(users)).to.equal(true);
          expect(users.length).to.be.above(0);
          users.forEach((user) => {
            expect(user).to.have.property("name");
            expect(user).to.have.property("email");
            expect(user).to.have.property("created_at");
            expect(user).to.have.property("avatar");
            expect(user).to.have.property("role");
            expect(user).to.have.property("tickets");
          });
        });
    });
  });

  describe("POST /api/users", function () {
    it("should respond with a 201 and the new user when supplied with valid data", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Test Person",
        email: "test@test.com",
        password: "averygreatpassword",
        role: "Student",
        username: "test1",
      });
      expect(response.status).to.equal(201);

      const { user } = response.body;
      expect(user).to.have.property("name");
      expect(user).to.have.property("email");
      expect(user).to.have.property("created_at");
      expect(user).to.have.property("role");
      expect(user).to.have.property("tickets");
      // We never EVER want to have this retrievable from a web endpoint
      expect(user).not.to.have.property("password");
    });

    it("should respond with an error if invalid user credentials are supplied", async () => {
      const response = await request(app).post("/api/users").send({
        name: "Test Person",
      });

      expect(response.status).to.equal(400);
    });
  });

  describe("POST /api/users/authenticate", function () {
    it("should respond positively to a login with existent user and correct password", async () => {
      await User.create({
        email: "test1@test.com",
        name: "Mr Test",
        password: "password1",
        role: "Student",
        username: "testStudent1",
      });
      const response = await request(app)
        .post("/api/users/authenticate")
        .send({ username: "testStudent1", password: "password1" });
      expect(response.status).to.equal(200);
    });
    it("should respond with an error to a login with existent user and incorrect password", async () => {
      await User.create({
        email: "test2@test.com",
        name: "Mr Test2",
        password: "password2",
        role: "Student",
        username: "testStudent2",
      });
      await request(app)
        .post("/api/users/authenticate")
        .send({ email: "test1@test.com", password: "wrongpassword" })
        .expect(403)
        .then(() => {});
    });
  });
});
