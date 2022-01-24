if (!process.env.REMOTE_TEST) {
  require("../../environment/test");
}
const expect = require("chai").expect;
const request = require("supertest");
const { app } = require("../../servers/app");
const runSeed = require("../../db/seeds/seed");
const mongoose = require("mongoose");

describe("GET /api/users", function () {
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
  }).timeout(30000);
});