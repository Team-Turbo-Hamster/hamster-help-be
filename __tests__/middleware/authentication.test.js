const { suite, describe, it } = require("mocha");
const { expect } = require("chai");
const jwt = require("../../api/jwt");
const {
  isAuth,
  isStudent,
  isTutor,
} = require("../../middleware/authentication");

suite("authentication middleware", () => {
  describe("isAuth", () => {
    it("should return a decoded valid token when passed an encoded valid token", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Student",
        },
        "test@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const output = isAuth(fakeReq);

      expect(output).not.to.equal(false);
    });
    it("should return false when no token is provided", () => {
      const fakeReq = {
        headers: {
          authorization: `Bearer Of Bad News`,
        },
      };
      const output = isAuth(fakeReq);

      expect(output).to.equal(false);
    });
    it("should return false when an invalid token is provided", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Student",
        },
        "stolenjwt@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isAuth(fakeReq);

      expect(output).to.equal(false);
    });
  });
  describe("isStudent", () => {
    it("should return a decoded token for a valid student token", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Student",
        },
        "test@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isStudent(fakeReq);

      expect(output).to.equal(true);
    });
    it("should return false for a valid non-student token", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Tutor",
        },
        "test@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isStudent(fakeReq);

      expect(output).to.equal(false);
    });
    it("should return false when an invalid token is provided", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Student",
        },
        "stolenjwt@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isStudent(fakeReq);

      expect(output).to.equal(false);
    });
  });
  describe("isTutor", () => {
    it("should return a decoded token for a valid tutor token", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Tutor",
        },
        "test@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isTutor(fakeReq);

      expect(output).to.equal(true);
    });
    it("should return false for a valid non-tutor token", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Student",
        },
        "test@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isTutor(fakeReq);

      expect(output).to.equal(false);
    });
    it("should return false when an invalid token is provided", () => {
      const token = jwt.sign(
        {
          email: "test@test.com",
          avatar: "placeholder",
          name: "Mr Test",
          role: "Tutor",
        },
        "stolenjwt@test.com"
      );
      const fakeReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const output = isTutor(fakeReq);

      expect(output).to.equal(false);
    });
  });
});
