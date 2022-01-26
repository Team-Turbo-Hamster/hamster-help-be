const runSeed = require("./seed");
const mongoose = require("mongoose");

runSeed()
  .then(() => {
    console.log("*** SEEDING COMPLETE ***");
  })
  .catch((err) => {
    console.log("Seeding Failed!", err);
  })
  .finally(() => {
    mongoose.disconnect();
  });
