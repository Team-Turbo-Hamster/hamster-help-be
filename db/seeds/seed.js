const env = require("../../environment/test");
const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const userData = require(`../data/${process.env.NODE_ENV}-data/users-tickets.js`);

const runSeed = async () => {
  const connection = await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Removing existing data...");
  console.log("> Removing Users...");
  await User.deleteMany();
  console.log("> Removing Tickets...");
  await Ticket.deleteMany();
  console.log("---> Completed");

  console.log("Adding new users...");
  await User.insertMany(
    userData.map(({ name, email, avatar, role }) => ({
      name,
      email,
      avatar,
      role,
    }))
  );
  console.log("---> Completed");

  console.log("Retrieving users from database...");
  const users = await User.find();
  console.log("---> Completed");

  console.log("Adding user tickets...");
  users.forEach(async (user) => {
    const userTickets = userData.find(
      (seedUser) => seedUser.email === user.email
    ).tickets;

    if (userTickets.length > 0) {
      await Ticket.insertMany(
        userTickets.map(({ title, body, tags, image }) => ({
          user: mongoose.Types.ObjectId(user._id),
          title,
          body,
          tags,
          image,
        }))
      );
    }
  });
  console.log("---> Completed");
};

module.exports = runSeed;
