const e = require("express");
const jwt = require("../api/jwt");
const { rejectQuery } = require("../errors/rejectQuery");

const hasToken = (req) =>
  req.headers.authorization &&
  req.headers.authorization.split(" ")[0] === "Bearer";

const getToken = (req) => req.headers.authorization.split(" ")[1];

const isAuth = (req) => {
  if (hasToken(req)) {
    try {
      const token = getToken(req);
      const decoded = jwt.decode(token);

      return jwt.verify(token, decoded.payload.email);
    } catch (err) {
      return false;
    }
  }

  return false;
};

const isStudent = async (req, res, next) => {
  try {
    if (isAuth(req)) {
      const token = getToken(req);
      const decoded = jwt.decode(token);
      console.log(decoded.payload);
      if (decoded.payload.role === "Student") {
        req.user = decoded.payload._id;
        next();
      } else {
        await rejectQuery("User is not a student", 400);
      }
    } else {
      await rejectQuery("Invalid or no token provided", 400);
    }
  } catch (err) {
    next(err);
  }
};

const isTutor = async (req, res, next) => {
  if (isAuth(req)) {
    try {
      const token = getToken(req);
      const decoded = jwt.decode(token);
      if (decoded.payload.role === "Tutor") {
        req.user = decoded.payload._id;
        next();
      } else {
        await rejectQuery("User is not a tutor", 400);
      }
    } catch (err) {
      next(err);
    }
  } else {
    await rejectQuery("Invalid or no token provided", 400);
  }
};

module.exports = { isAuth, isStudent, isTutor };
