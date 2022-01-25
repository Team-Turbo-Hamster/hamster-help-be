const mongoose = require("mongoose");
const validator = require("validator");
const { encryptPassword } = require("../api/password");

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
    password: {
      type: String,
      select: false,
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
      enum: ["Student", "Tutor"],
      default: "Student",
    },
    tickets: [{ type: mongoose.Schema.ObjectId, ref: "Ticket" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  encryptPassword(user.password)
    .then((encrypted) => {
      user.password = encrypted.toString();
      next();
    })
    .catch((err) => {
      next(err);
    });
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tickets",
    match: { resolved: false },
    select: "title body tags zoomLink image created_at resolved",
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
