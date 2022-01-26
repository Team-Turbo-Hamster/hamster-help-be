const socketio = require("socket.io");
const { validatePassword } = require("../api/password");
const jwt = require("../api/jwt");
const User = require("../models/user.model");
const Joi = require("joi");

module.exports = (httpServer) => {
  const io = new socketio.Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to server");

    socket.on("authenticate", async ({ email, password }) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });

      try {
        const { value, error } = schema.validate({ email, password });

        if (error) {
          socket.emit("auth-result", { error });
        } else {
          const user = await User.findOne(
            { email },
            "email +password avatar name role"
          );

          if (user) {
            const isValid = await validatePassword(password, user.password);

            if (isValid) {
              const { name, avatar, role, email, _id } = user;
              const token = jwt.sign({ _id, avatar, role, email }, email);

              socket.join("authenticated");

              socket.emit("auth-result", {
                name,
                avatar,
                role,
                email,
                _id,
                token,
              });
            } else {
              socket.emit("auth-result", { error: "Invalid password" });
            }
          } else {
            socket.emit("auth-result", { error: "Invalid email" });
          }
        }
      } catch (err) {
        console.log(err);
        socket.emit("auth-result", { error: "Unknown error" });
      }
    });
  });

  return io;
};
