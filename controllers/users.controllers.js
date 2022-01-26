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

    console.log("***********************************");
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
    console.log(error);
    next(error);
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
        const { name, avatar, role, email, _id } = user;
        const token = jwt.sign({ _id, avatar, role, email }, email);

        req.socket.join("auth");

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
