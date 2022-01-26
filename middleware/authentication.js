const jwt = require("../api/jwt");

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

const isStudent = (req) => {
  if (isAuth(req)) {
    try {
      const token = getToken(req);
      const decoded = jwt.decode(token);

      return decoded.payload.role === "Student";
    } catch (err) {
      return false;
    }
  }

  return false;
};

const isTutor = (req) => {
  if (isAuth(req)) {
    try {
      const token = getToken(req);
      const decoded = jwt.decode(token);

      return decoded.payload.role === "Tutor";
    } catch (err) {
      console.log(err);

      return false;
    }
  }

  return false;
};

module.exports = { isAuth, isStudent, isTutor };
