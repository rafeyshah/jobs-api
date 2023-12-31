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
    isDeleted: false,
    role: req.body.role,
    country: req.body.country.toUpperCase(),
  };

  let userExists = null;
  try {
    const findFromExistedUser = await User.findOne({ email: user.email }).then(
      (existUser) => {
        userExists = existUser;
      }
    );
    console.log("User exists: ", userExists);
    if (!userExists || (userExists && userExists.isDeleted === true)) {
      console.log("Inside");
      const newlyCreatedUser = await User.create(user);
      res.json({
        msg: "Signup Successfully",
        body: user,
      });
    } else {
      res.status(400).json({
        message: "User already exists",
      });
    }
    console.log("Outside");
  } catch (ex) {
    res.status(400).json({
      message: "User Already Exists || Check Error Below",
      error: ex,
    });
  }
};

exports.getUser = async function (req, res) {
  try {
    const login = await User.findOne({
      email: req.body.email,
    });
    console.log("User: ", login);
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
          user: login,
        });
      } else {
        res.status(400).json({
          error: "Password Incorrect",
        });
      }
    } else {
      res.status(400).json({
        error: `Error occurred: login not found`,
      });
    }
  } catch (err) {
    res.json({
      error: `Error occurred: ${err}`,
    });
  }
};

exports.getUsers = async function (req, res) {
  try {
    const page = req.query.page;
    const off = req.query.off;
    if (page && off) {
      const allQueryUsers = await User.find({ isDeleted: false })
        .skip(page * off)
        .limit(off);
      res.json({
        msg: `Getting Entites of Page ${page} and Offset ${off}`,
        data: allQueryUsers,
      });
    } else {
      const allUsers = await User.find({ isDeleted: false });
      res.json({
        msg: "All users in dashboard || Query Parameters Found",
        data: allUsers,
      });
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.getSingleUser = async function (req, res) {
  try {
    const getSingleUser = await User.findById(req.params.id);
    res.json({
      msg: "Fetching single user...",
      data: getSingleUser,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.deleteUser = async function (req, res) {
  try {
    console.log(req.params.id);
    const deletedUser = await User.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    console.log(deletedUser);
    res.json({
      msg: "Deleting User",
      data: "isDeleted: true",
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.updateUser = async function (req, res) {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userId: req.body.userId,
    image: req.body.image,
    isDeleted: false,
    role: req.body.role,
    country: req.body.country,
  };

  let userExists = null;
  try {
    const findFromExistedUser = await User.findOne({
      email: user.email,
      isDeleted: false,
    }).then((existUser) => {
      userExists = existUser;
    });
    console.log("User exists: ", userExists);
    if (userExists && userExists.isDeleted === false) {
      res.status(400).json({
        msg: "Email Already Existed",
      });
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, user);
      res.json({
        msg: "Updating User",
        data: user,
      });
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
