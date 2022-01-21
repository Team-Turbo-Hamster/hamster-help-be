const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please insert your name"],
    },
    email: {
      type: String,
      required: [true, "Please insert your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please insert valid email"],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    avatar: {
      type: Object,
    },
    role: {
      type: String,
      enum: ["student", "tutor"],
      default: "student",
    },

    // tickets: [{ type: mongoose.Schema.ObjectId, ref: "Ticket" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("tickets", {
  ref: "Ticket",
  foreignField: "user",
  localField: "_id",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
