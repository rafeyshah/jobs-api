const User = require("../models/userDOA");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validate } = require("../models/user");
dotenv.config();

exports.createUser = async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    userId: req.body.userId,
    image: req.body.image,
    isDeleted: req.body.isDeleted,
    role: req.body.role,
  };

  try {
    const newlyCreatedUser = await User.create(user);
    res.json({
      msg: "Signup Successfully",
      body: user,
    });
  } catch (ex) {
    res.json({
      error: ex,
    });
  }
};

exports.getUser = async function (req, res) {
  try {
    const login = await User.findOne({
      email: req.body.email,
    });
    if (login) {
      const password_valid = await bcrypt.compare(
        req.body.password,
        login.password
      );
      if (password_valid) {
        const token = jwt.sign(
          { id: login.id, createdAt: login.createdAt },
          process.env.TOKEN_SECRET
        );
        res.json({
          msg: `${req.body.email} successfully logged in`,
          token: token,
        });
      } else {
        res.json({
          error: "Password Incorrect",
        });
      }
    }
  } catch (err) {
    console.log("error", err);
  }
};

exports.getUsers = async function (req, res) {
  try {
    const allUsers = await User.find({});
    res.json({
      msg: "All users in dashboard",
      data: allUsers,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
