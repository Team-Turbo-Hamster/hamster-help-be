const { it, describe } = require("@jest/globals");
const request = require("supertest");
const { app } = require("../servers/app");

describe("GET /api/sir-not-appearing/in-this-app", () => {
  it("should return a 404 error for a non-existent endpoint", () =>
    request(app).get("/api/sir-not-appearing/in-this-app").expect(404));
});

describe("GET /api", () => {
  it("should return a JSON representation of all available API endpoints", () => {});
});
