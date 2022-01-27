const socketio = require("socket.io");
const { validatePassword } = require("../api/password");
const jwt = require("../api/jwt");
const SM = require("../socket-messages");
const User = require("../models/user.model");
const Joi = require("joi");
const Ticket = require("../models/ticket.model");
const authSocket = require("../middleware/authSocket");

module.exports = (httpServer) => {
  const io = new socketio.Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected to server");

    socket.on(SM.SENT_FROM_CLIENT.AUTHENTICATE, async ({ email, password }) => {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      });

      try {
        await schema.validateAsync({ email, password });

        const user = await User.findOne(
          { email },
          "email +password avatar name role"
        );

        if (user) {
          const isValid = await validatePassword(password, user.password);

          if (isValid) {
            const { name, avatar, role, email, _id } = user;
            const token = jwt.sign({ _id, avatar, role, email }, email);

            socket.join(SM.AUTHENTICATED_ROOM);

            socket.emit(SM.SENT_TO_CLIENT.AUTHENTICATED, {
              name,
              avatar,
              role,
              email,
              _id,
              token,
            });
          } else {
            throw new Error("Incorrect password");
          }
        } else {
          throw new Error("User does not exist");
        }
      } catch (error) {
        socket.emit(SM.SENT_TO_CLIENT.ERROR, {
          error,
        });
      }
    });

    socket.on(SM.SENT_FROM_CLIENT.REJOIN, ({ token }) => {
      try {
        const { email } = jwt.decode(token).payload;

        if (jwt.verify(token, email)) {
          socket.join(SM.AUTHENTICATED_ROOM);
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        socket.emit(SM.SENT_TO_CLIENT.ERROR, { error });
      }
    });

    socket.on(
      SM.SENT_FROM_CLIENT.NEW_TICKET,
      //authSocket.isAuth,
      async ({ body, title, user }) => {
        const ticketSchema = Joi.object({
          body: Joi.string().max(10000).required(),
          title: Joi.string().max(500).required(),
          user: Joi.required(),
        });

        try {
          await ticketSchema.validateAsync({ body, title, user });

          const ticket = await Ticket.create({ title, body, user });

          await User.findByIdAndUpdate(
            user,
            { $push: { tickets: ticket.id } },
            { new: true }
          );

          io.to(SM.AUTHENTICATED_ROOM).emit(SM.SENT_TO_CLIENT.NEW_TICKET, {
            ticket,
          });
        } catch (error) {
          socket.emit(SM.SENT_TO_CLIENT.ERROR, { error });
        }
      }
    );
  });

  return io;
};
