const jwt = require("../api/jwt");
const SM = require("../socket-messages");

const validToken = (token) => {
  try {
    const decoded = jwt.decode(token);

    if (jwt.verify(token, decoded.payload.email)) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

const isAuth = (socket, { token }, next) => {
  if (validToken(token)) {
    return next(data);
  } else {
    return () => {
      socket.emit(
        SM.SEND_TO_CLIENT.ERROR,
        new Error("User is not authenticated")
      );
    };
  }
};

const isRole = (socket, data, next, role) => {
  const { token } = data;

  try {
    if (validToken(token)) {
      const decoded = jwt.decode(token);
      if (decoded.payload.role === role) {
        return next(data);
      } else {
        throw new Error(`User is not a ${role}`);
      }
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    return () => socket.emit(SM.SENT_TO_CLIENT.ERROR, { error });
  }
};

const isStudent = (socket, data, next) => {
  return isRole(socket, data, next, "Student");
};

const isTutor = (socket, data, next) => {
  return isRole(socket, data, next, "Tutor");
};

module.exports = { isAuth, isStudent, isTutor };
