const { encryptPassword } = require("../api/password");
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

    const user = await User.create({
      ...userFields,
      password: await encryptPassword(userFields.password),
    });
    res.status(201).send({ user });
  } catch (error) {
    console.log(error);
  }
};
