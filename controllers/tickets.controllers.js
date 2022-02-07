const { rejectQuery } = require("../errors/rejectQuery");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { cloudinary } = require("../utils/cloudinary");
const log = require("../log");

const uploadImages = async (images) => {
  const uploadedImages = await Promise.all(
    images.map(async (image) => {
      const img = await cloudinary.uploader.upload(image, {
        upload_preset: "tickets",
      });

      return img.public_id;
    })
  );

  return uploadedImages;
};

exports.createTicket = async (req, res, next) => {
  const logger = log.getLogger("Ticket Controller > createTicket");
  const { body, title, images = [] } = req.body;

  logger.log(req.user);
  logger.log("Received request to create ticket");
  try {
    if (!body || !title) {
      logger.warn("Ticket fields missing");
      await rejectQuery("Ticket fields missing", 400);
    }

    let uploadedImages = [];

    if (images.length > 0) {
      logger.info(`Uploading ${images.length} images...`);
      const data = await uploadImages(images);
      uploadedImages = data;
    }

    logger.info("Saving ticket...");
    const ticket = await Ticket.create({
      ...req.body,
      images: uploadedImages,
      user: req.user,
    });

    logger.info("Adding ticket to user...");
    await User.findByIdAndUpdate(
      req.user,
      {
        $push: { tickets: ticket.id },
      },
      { new: true }
    );

    logger.info("New Ticket created, sending");
    res.status(201).send({ ticket });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

exports.getAllTickets = async (req, res, next) => {
  const logger = log.getLogger("Ticket Controller > getAllTickets");
  try {
    logger.info("Retrieving tickets from DB");
    const tickets = await Ticket.find();

    logger.info(`Sending ${tickets.length} tickets to client`);
    res.status(200).send({ tickets });
  } catch (error) {
    next(error);
  }
};

exports.getTicketById = async (req, res, next) => {
  const { ticket_id } = req.params;

  try {
    const ticket = await Ticket.findById(ticket_id).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
      },
    });

    console.log(ticket);
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

exports.getAllTicketsUnresolved = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ resolved: { $eq: false } });

    res.status(200).send({ tickets });
  } catch (error) {
    next(error);
  }
};

exports.getAllTicketsResolved = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ resolved: { $eq: true } });

    res.status(200).send({ tickets });
  } catch (error) {
    next(error);
  }
};

exports.getAllTicketsByTag = async (req, res, next) => {
  const { tag_name } = req.params;

  try {
    const tickets = await Ticket.find({ tags: { $in: tag_name } });
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
  const { ticket_id } = req.params;
  try {
    const ticket = await Ticket.findByIdAndDelete(ticket_id);
    res.status(204).send({ msg: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
};
