const jwt = require("jsonwebtoken");
const User = require("../models/userDOA");

exports.authentication = async (req, res, next) => {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    let user = await User.findOne({
      _id: decoded.id,
    });
    req.user = user;
    next();
  } catch (err) {
    console.log("Error: ", err);
    res.status(401).json({ msg: "Couldnot Authenticate" });
  }
};
