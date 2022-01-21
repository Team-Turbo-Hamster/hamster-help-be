const User = require("../models/user.model");

exports.getAllUsers = async (req, res, next) => {
  console.log(req.body);

  const users = await User.find();
  res.status(200).send({ users });
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
  }
};
