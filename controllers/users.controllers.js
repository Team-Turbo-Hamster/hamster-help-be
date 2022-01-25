const User = require("../models/user.model");
const { cloudinary } = require("../utils/cloudinary");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).send({ users });
};

exports.createUser = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userFields = { ...req.body };

    if (avatar) {
      const uploadedRes = await cloudinary.uploader.upload(avatar, {
        upload_preset: "avatar",
      });

      userFields.avatar = uploadedRes.public_id;
    }

    const user = await User.create(userFields);
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    console.log(user_id);
    const user = await User.findById(user_id);
    console.log(user);
    res.status(200).send({ user });
  } catch (error) {
    console.log(error);
  }
};
