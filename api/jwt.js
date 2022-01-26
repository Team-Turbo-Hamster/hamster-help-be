const jwt = require("jsonwebtoken");

const options = {
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE,
  expiresIn: "30d",
  algorithm: "RS256",
};

const sign = (payload, subject) => {
  const signOptions = { ...options, subject };
  return jwt.sign(payload, process.env.PRIVATE_KEY, signOptions);
};

const verify = (token, subject) => {
  const verifyOptions = {
    ...options,
    subject,
    algorithm: ["RS256"],
  };

  try {
    return jwt.verify(token, process.env.PUBLIC_KEY, verifyOptions);
  } catch (err) {
    return false;
  }
};

const decode = (token) => {
  return jwt.decode(token, { complete: true });
};

module.exports = {
  sign,
  verify,
  decode,
};
