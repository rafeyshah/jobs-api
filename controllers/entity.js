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
    country: req.body.country.toUpperCase(),
    jobType: req.body.jobType,
    linkedIn: req.body.linkedIn,
    contact: req.body.contact,
    additionalNotes: req.body.additionalNotes,
    clientResponse: req.body.clientResponse,
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
    console.log("Page: ", req.query.page);
    console.log("offset: ", req.query.off);
    const page = req.query.page;
    const off = req.query.off;
    if (page && off) {
      const getQueryEntities = await Entity.find({})
        .skip(page * off)
        .limit(off);
      res.json({
        msg: `Getting Entites of Page ${page} and Offset ${off}`,
        data: getQueryEntities,
      });
    } else {
      const getAllEntities = await Entity.find({});
      res.json({
        msg: "Getting all entities || Didn't find query parameter",
        data: getAllEntities,
      });
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.getAppEntities = async function (req, res) {
  try {
    console.log("User: ", req.user);
    console.log("Page: ", req.query.page);
    console.log("offset: ", req.query.off);
    const page = req.query.page;
    const off = req.query.off;
    if (page && off) {
      const getQueryEntities = await Entity.find({ country: req.user.country })
        .skip(page * off)
        .limit(off);
      res.json({
        msg: `Getting Entites of Page ${page} and Offset ${off}`,
        data: getQueryEntities,
      });
    } else {
      const getAllEntities = await Entity.find({ country: req.user.country });
      res.json({
        msg: "Getting all entities || Didn't find query parameter",
        data: getAllEntities,
      });
    }
  } catch (err) {
    res.json({
      error: err,
    });
  }
};

exports.getSingleEntity = async function (req, res) {
  try {
    const getSingleEntity = await Entity.findById(req.params.id);
    res.json({
      msg: "Fetching single entity...",
      data: getSingleEntity,
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
    clientResponse: req.body.clientResponse,
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
          country: result.data.country.toUpperCase(),
          jobType: result.data.jobType,
          linkedIn: result.data.linkedIn,
          contact: result.data.contact,
          additionalNotes: result.data.additionalNotes,
          clientResponse: result.data.clientResponse,
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
    console.log("Array: ", result[0].countries);

    res.json({
      msg: "Fetching Countries",
      data: result[0].countries,
    });
  } catch (err) {
    res.json({
      error: err,
    });
  }
};
