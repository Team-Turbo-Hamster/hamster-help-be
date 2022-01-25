const { rejectQuery } = require("../errors/rejectQuery");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

exports.createTicket = async (req, res, next) => {
  const userId = "61efbf0c773c5efadc63441c";
  const { body, title } = req.body;

  try {
    if (!body || !title) {
      await rejectQuery("Ticket fields missing", 400);
    }

    const ticket = await Ticket.create({
      ...req.body,
      user: userId,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { tickets: ticket.id },
      },
      { new: true }
    );

    res.status(201).send({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find();

    res.status(200).send({ tickets });
  } catch (error) {
    console.log(error);
  }
};
