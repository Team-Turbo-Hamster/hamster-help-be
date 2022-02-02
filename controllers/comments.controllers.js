const { rejectQuery } = require("../errors/rejectQuery");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");
const { cloudinary } = require("../utils/cloudinary");

exports.createComment = async (req, res, next) => {
  const { ticket_id } = req.params;
  const { body } = req.body;

  const com = { body, user: req.user };
  try {
    const comment = await Ticket.findByIdAndUpdate(
      ticket_id,
      {
        $push: { comments: com },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
      },
    });
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};

exports.removeComment = async (req, res, next) => {
  const { ticket_id } = req.params;
  const { comment_id } = req.body;

  console.log(comment_id, "====");
  try {
    const comment = await Ticket.findByIdAndUpdate(
      ticket_id,
      {
        $pull: { comments: { _id: comment_id } },
      },
      { new: true }
    ).populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User",
      },
    });
    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};
