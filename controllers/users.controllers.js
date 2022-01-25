const User = require("../models/user.model");
const token = require("../api/token");
const { cloudinary } = require("../utils/cloudinary");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).send({ users });
};

exports.createUser = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const userFields = {
      ...req.body,
    };

    if (avatar) {
      const uploadedRes = await cloudinary.uploader.upload(avatar, {
        upload_preset: "avatar",
      });

      userFields.avatar = uploadedRes.public_id;
    }

    const user = (
      await User.create({
        ...userFields,
      })
    ).toObject();

    delete user.password;

    const jwt = token.makeToken(user);

    res.status(201).send({ jwt });
  } catch (error) {
    next({ status: 400, msg: error.msg });
  }
};

exports.authenticateUser = async (req, res, next) => {
  console.log(req, res);

  res.status(200).send(req.user);
};
