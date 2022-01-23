const jwt = require("jsonwebtoken");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  debug: true,
});

if (!process.env.PRIVATE_KEY && !process.env.PUBLIC_KEY) {
  throw new Error(
    "PRIVATE_KEY and PUBLIC_KEY for tokens not set in .env or environment variables"
  );
}

const makeToken = (userObj) => {
  return jwt.sign(userObj, process.env.PRIVATE_KEY, { algorithm: "RS256" });
};

const verifyToken = async (token) => {
  return jwt.verify(token, process.env.PUBLIC_KEY, { algorithm: "RS256" });
};

module.exports = { makeToken, verifyToken };
