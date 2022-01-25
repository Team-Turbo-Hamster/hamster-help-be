const { rejectQuery } = require("../errors/rejectQuery");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

exports.createTicket = async (req, res, next) => {
  const userId = "61efeb4f385093713132334c";
  const { body, title } = req.body;

  try {
    if (!body || !title) {
      await rejectQuery("Ticket fields missing", 400);
    }

    const ticket = await Ticket.create({
      ...req.body,
      user: userId,
    });

    await User.findByIdAndUpdate(
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
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  const { ticket_id } = req.params;
  try {
    const ticket = await Ticket.findById(ticket_id);

    res.status(200).send({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.getTicketByUserId = async (req, res, next) => {
  const { user_id } = req.params;

  try {
    const tickets = await Ticket.find({ user: { $eq: user_id } });

    res.status(200).send({ tickets });
  } catch (error) {
    next(error);
  }
};
