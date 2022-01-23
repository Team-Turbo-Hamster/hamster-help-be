require("dotenv").config({
  path: `./env/.env.${process.env.NODE_ENV}`,
  debug: true,
});

const mongoose = require("mongoose");
const User = require("../../models/user.model");
const userData = require(`../data/${process.env.NODE_ENV}-data/users.js`);

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Seeding users...");
    User.deleteMany().then(() => {
      User.insertMany(userData)
        .then((result) => {
          console.log("--> User seeding complete");
        })
        .catch((err) => {
          console.log("!!! Error seeding users: ", err);
        });
    });
  })
  .catch((err) => {
    console.log("Mongoose Connection Failed!", err);
  });
