const e = require("express");
const jwt = require("../api/jwt");

const getSocketToken = (socket) => socket.auth.token;

const isAuth = (token) => {
  if (token) {
    try {
      const decoded = jwt.decode(token);

      return jwt.verify(token, decoded.payload.email);
    } catch (err) {
      return false;
    }
  }

  return false;
};

const isStudent = async (socket, next) => {
  try {
    const token = getSocketToken(socket);

    if (isAuth(token)) {
      const decoded = jwt.decode(token);
      if (decoded.payload.role === "Student") {
        req.user = decoded.payload._id;
        next();
      } else {
        socket.emit("error", { msg: "User is not a student" });
      }
    } else {
      socket.emit("error", { msg: "No token provided" });
    }
  } catch (err) {
    next(err);
  }
};

const isTutor = async (socket, next) => {
  try {
    const token = getSocketToken(socket);

    if (isAuth(token)) {
      const decoded = jwt.decode(token);
      if (decoded.payload.role === "Tutor") {
        req.user = decoded.payload._id;
        next();
      } else {
        socket.emit("error", { msg: "User is not a tutor" });
      }
    } else {
      socket.emit("error", { msg: "No token provided" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { isAuth, isStudent, isTutor };
