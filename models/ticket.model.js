const mongoose = require("mongoose");
const validator = require("validator");
const uuid = require("uuid");

const commentSchema = new mongoose.Schema({
  comment_id: {
    type: String,
    default: uuid.v4().toString,
  },
  body: {
    type: String,
    required: [true, "Please add a text to a comment"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Comment must have Commenter"],
  },
});

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "Please provide a title"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
    images: [
      {
        type: Object,
      },
    ],
    created_at: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ticketSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "name avatar role created_at",
//   });

//   next();
// });

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
