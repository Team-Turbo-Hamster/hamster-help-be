const User = require("../models/user.model");
const jwt = require("../api/jwt");
const { cloudinary } = require("../utils/cloudinary");
const { validatePassword } = require("../api/password");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).send({ users });
};

exports.createUser = async (req, res, next) => {
  try {
    const { avatar, name, email, password, role } = req.body;
    let avatar_img_location;

    if (avatar) {
      const uploadedRes = await cloudinary.uploader.upload(avatar, {
        upload_preset: "avatar",
      });

      avatar_img_location = uploadedRes.public_id;
    }

    const { created_at, tickets } = await User.create({
      avatar: avatar_img_location || "",
      name,
      email,
      password,
      role,
    });

    res.status(201).send({
      user: {
        avatar: avatar_img_location || "",
        name,
        email,
        role,
        created_at,
        tickets,
      },
    });
  } catch (error) {
    next({ status: 400, msg: error.msg });
  }
};

exports.authenticateUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne(
      { email },
      "email +password avatar name role"
    );

    if (user) {
      const isValid = await validatePassword(password, user.password);

      if (isValid) {
        const { name, avatar, role, email } = user;
        const token = jwt.sign({ user, avatar, role, email }, email);

        res.status(200).send({
          token,
          name,
          avatar,
          role,
          email,
        });
      } else {
        next({ status: 403, msg: "Invalid password" });
      }
    } else {
      next({ status: 403, msg: "Invalid username" });
    }
  } catch (err) {
    console.log(err);
    next({ status: 400, msg: err.msg });
  }
};
