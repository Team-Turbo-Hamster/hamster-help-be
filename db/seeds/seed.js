const mongoose = require("mongoose");
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const userData = require(`../data/${process.env.NODE_ENV}-data/users-tickets.js`);

const runSeed = async () => {
  const connection = await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await User.deleteMany();
  await Ticket.deleteMany();
  await User.insertMany(
    userData.map(({ name, email, avatar, role }) => ({
      name,
      email,
      avatar,
      role,
    }))
  );

  const users = await User.find();

  for (const user of users) {
    const seedUser = userData.find(
      (currentSeedUser) => currentSeedUser.email == user.email
    );

    if (seedUser.tickets) {
      for (const seedTicket of seedUser.tickets) {
        const { title, body, tags, image } = seedTicket;
        const ticket = await Ticket.create({
          user: mongoose.Types.ObjectId(user._id),
          title,
          body,
          tags,
          image,
        });
        user.tickets.push(mongoose.Types.ObjectId(ticket._id));
        await user.save();
      }
    }
  }
};

module.exports = runSeed;
