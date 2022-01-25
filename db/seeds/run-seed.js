const runSeed = require("./seed");

runSeed()
  .then(() => {
    console.log("*** SEEDING COMPLETE ***");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Seeding Failed!", err);
    process.exit(1);
  });
