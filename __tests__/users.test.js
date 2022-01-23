const { it, describe, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const { app } = require("../servers/app");
const runSeed = require("../db/seeds/seed");
const mongoose = require("mongoose");

beforeAll(() => runSeed());

afterAll(() => mongoose.disconnect());

describe("GET /api/users", () => {
  it("should response with an array of users", () =>
    request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toMatchObject({
            name: expect.any(String),
            email: expect.any(String),
            created_at: expect.any(String),
            avatar: expect.any(String),
            role: expect.any(String),
            tickets: expect.any(Array),
          });
        });
      }));
});
