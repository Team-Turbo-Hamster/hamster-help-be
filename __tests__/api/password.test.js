if (!process.env.REMOTE_TEST) {
  require("../../environment/test");
}

const chai = require("chai");
const expect = chai.expect;
const { encryptPassword, validatePassword } = require("../../api/password");

chai.use(require("chai-as-promised"));

describe("encryptPassword", () => {
  it("should return an encrypted password", async () => {
    const input = "password";
    const output = await encryptPassword(input);

    expect(output).to.be.a("string");
  });
  it("should throw an error when passed an empty password", async () => {
    const input = "";

    await expect(encryptPassword(input)).to.be.rejectedWith(Error);
  });
});

describe("validatePassword", () => {
  it("should return a Boolean value", async () => {
    const input = "password";
    const output = await validatePassword(
      input,
      "$2b$10$0aIWuZbwpj304PGSzd1WXee5rYy7VL/yXHDNCKIvtTzkAWHxfVoOa"
    );

    expect(output).to.be.a("boolean");
  });
  it("should return true for a valid password and encrypted password", async () => {
    const input = "password";
    const output = await validatePassword(
      input,
      "$2b$10$0aIWuZbwpj304PGSzd1WXee5rYy7VL/yXHDNCKIvtTzkAWHxfVoOa"
    );

    expect(output).to.equal(true);
  });
});
