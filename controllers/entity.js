const Entity = require("../models/entityDOA");
const { validateEntity } = require("../models/entity");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const Papa = require("papaparse");

const dotenv = require("dotenv");
dotenv.config();
const url = process.env.DB;
exports.createEntity = async function (req, res) {
  const { error } = validateEntity(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const entity = {
    companyName: req.body.companyName,
    website: req.body.website,
    country: req.body.country,
    jobType: req.body.jobType,
    linkedIn: req.body.linkedIn,
    contact: req.body.contact,
    additionalNotes: req.body.additionalNotes,
  };

  try {
    const newlyCreatedEntity = await Entity.create(entity);
    res.json({
      msg: "Created New Entity Successfully",
      data: entity,
    });
  } catch (ex) {
    res.json({
      error: ex,
    });
  }
};

exports.getEntities = async function (req, res) {
  try {
    console.log("All Queries", req.query);
    console.log("Page: ", req.query.page);
    console.log("offset: ", req.query.off);
    const getAllEntities = await Entity.find({});
    res.json({
      msg: "Getting all entities",
      data: getAllEntities,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.updateEntity = async function (req, res) {
  const entity = {
    companyName: req.body.companyName,
    website: req.body.website,
    country: req.body.country,
    jobType: req.body.jobType,
    linkedIn: req.body.linkedIn,
    contact: req.body.contact,
    additionalNotes: req.body.additionalNotes,
  };
  try {
    const updatedEntity = await Entity.findByIdAndUpdate(req.params.id, entity);
    res.json({
      msg: "Updating entity",
      data: entity,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.removeEntity = async function (req, res) {
  try {
    const removedEntity = await Entity.findByIdAndDelete(req.params.id);
    res.json({
      msg: `Group Removed ID: ${req.params.id}`,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.uploadCSV = async function (req, res) {
  try {
    const csvFile = req.file.buffer.toString();
    const csvArr = [];
    Papa.parse(csvFile, {
      header: true,
      step: async function (result) {
        console.log(result.data);
        csvArr.push(result.data);
        const { error } = validateEntity(result.data);
        if (error) return res.status(400).send(error.details[0].message);
        const entity = {
          companyName: result.data.companyName,
          website: result.data.website,
          country: result.data.country,
          jobType: result.data.jobType,
          linkedIn: result.data.linkedIn,
          contact: result.data.contact,
          additionalNotes: result.data.additionalNotes,
        };

        const newlyCreatedEntity = await Entity.create(entity);
      },
      complete: function () {
        // console.log(csvArr);
        res.json({
          msg: "Uploading and parsing csv",
          data: csvArr,
        });
      },
    });
  } catch (ex) {
    res.json({
      error: ex,
    });
  }
};

exports.fetchCountries = async function (req, res) {
  console.log("Before");
  try {
    console.log("Started");
    const result = await Entity.aggregate([
      {
        $group: {
          _id: 1,
          countries: {
            $addToSet: "$country",
          },
        },
      },
    ]);
    console.log("Array: ", result);

    res.json({
      msg: "Fetching Countries",
      data: result,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
