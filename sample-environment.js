// Put this in environment/development.js or environment/test.js
process.env = {
  ...process.env,
  NODE_ENV: "environment",
  PORT: 5000,
  CLIENT_URL: "http://localhost:3000",
  PUBLIC_KEY: "PUBLIC_KEY",
  PRIVATE_KEY: "PRIVATE_KEY",
  DATABASE: "MONGODB URL",
  CLOUDINARY_NAME: "CLOUDINARY_NAME",
  CLOUDINARY_API_KEY: "CLOUDINARY_API_KEY",
  CLOUDINARY_API_SECRET: "CLOUDINARY_API_SECRET",
};
