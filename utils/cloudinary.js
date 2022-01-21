require("dotenv").config({
  path: "./env/.env.development",
  debug: true,
});

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary.config({
//   cloud_name: "turbo-hamster",
//   api_key: "783751753523248",
//   api_secret: "XTN1DkPYVBzsAN4v9I6ZJjqcHTA",
// });

module.exports = { cloudinary };
