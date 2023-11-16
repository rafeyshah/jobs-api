const Groups = require("../models/groupsDOA");
const { validate } = require("../models/groups");

exports.createGroup = async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const group = {
    name: req.body.name,
    works: req.body.works,
  };

  try {
    const newlyCreatedGroup = await Groups.create(group);
    res.json({
      msg: "Group created successfully",
      data: group,
    });
  } catch (ex) {
    res.json({
      error: ex,
    });
  }
};

exports.getGroups = async function (req, res) {
  try {
    const getAllGroup = await Groups.find({}).populate("works");
    res.json({
      msg: "Getting all groups",
      data: getAllGroup,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.updateGroup = async function (req, res) {
  const group = {
    name: req.body.name,
    works: req.body.works,
  };
  try {
    const updatedGroup = await Groups.findByIdAndUpdate(req.params.id, group);
    res.json({
      msg: `Updated group id: ${req.params.id}`,
      data: group,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.removeGroup = async function (req, res) {
  try {
    const removedGroup = await Groups.findByIdAndDelete(req.params.id);
    res.json({
      msg: `Group id removed ${req.params.id}`,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
