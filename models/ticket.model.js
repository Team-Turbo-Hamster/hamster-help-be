const mongoose = require("mongoose");
const validator = require("validator");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Please provide a title"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Ticket must belong to a user"],
    },

    body: {
      type: String,
      required: [true, "Please provide a description"],
    },
    tags: {
      type: [String],
    },
    zoomLink: {
      type: String,
      validate: [validator.isURL, "Please provide a valid link"],
    },
    image: {
      type: Object,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ticketSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name avatar role created_at",
  });

  next();
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;