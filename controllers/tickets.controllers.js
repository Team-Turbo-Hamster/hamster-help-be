const { promise } = require("bcrypt/promises");
const { rejectQuery } = require("../errors/rejectQuery");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

exports.createTicket = async (req, res, next) => {
  const { body, title } = req.body;
  const io = req.app.get("socket.io");

  try {
    if (!body || !title) {
      await rejectQuery("Ticket fields missing", 400);
    }

    const ticket = await Ticket.create({
      ...req.body,
      user: req.user,
    });

    await User.findByIdAndUpdate(
      req.user,
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

    if (!ticket) {
      await rejectQuery("Not Found", 404);
    }

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

exports.updateTicket = async (req, res, next) => {
  const { ticket_id } = req.params;
  const { title, body } = req.body;
  try {
    if (!body || !title) {
      await rejectQuery("Ticket fields missing", 400);
    }

    const ticket = await Ticket.findByIdAndUpdate(ticket_id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.removeTicket = async (req, res, next) => {
  //TODO: protect so only owner can delete a ticket/ tutor???

  const { ticket_id } = req.params;
  try {
    const ticket = await Ticket.findByIdAndDelete(ticket_id);
    res.status(204).send({ msg: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.resolveTicket = async (req, res, next) => {
  //TODO: only tutors can resolve (needs protection route)
  const { ticket_id } = req.params;
  console.log(ticket_id);
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticket_id,
      {
        $set: { resolved: true },
      },
      {
        new: true,
      }
    );

    res.status(200).send({ ticket });
  } catch (error) {
    next(error);
  }
};

exports.unResolveTicket = async (req, res, next) => {
  //TODO: only tutors can resolve (needs protection route)
  const { ticket_id } = req.params;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticket_id,
      {
        $set: { resolved: false },
      },
      {
        new: true,
      }
    );

    res.status(200).send({ ticket });
  } catch (error) {
    next(error);
  }
};
