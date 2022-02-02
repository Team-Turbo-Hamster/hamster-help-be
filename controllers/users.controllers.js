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
    console.log(req.body, "======================");
    const { avatar, name, email, password, role, username } = req.body;
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
      username,
    });

    res.status(201).send({
      user: {
        avatar: avatar_img_location || "",
        name,
        email,
        role,
        username,
        created_at,
        tickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.authenticateUser = async (req, res, next) => {
  const io = req.app.get("socket.io");

  try {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await User.findOne(
      { username },
      "email +password avatar name role"
    );
    console.log(user);
    if (user) {
      const isValid = await validatePassword(password, user.password);

      if (isValid) {
        const { name, avatar, role, email, _id, username } = user;
        const token = jwt.sign({ _id, avatar, role, email }, email);

        res.status(200).send({
          token,
          name,
          avatar,
          role,
          email,
          _id,
          username,
        });
      } else {
        next({ status: 403, msg: "Invalid password" });
      }
    } else {
      next({ status: 403, msg: "Invalid username" });
    }
  } catch (err) {
    next({ status: 400, msg: err.msg });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  req.params.user_id = req.user;
  next();
};
