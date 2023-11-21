const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const entitySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: false,
      required: true,
    },
    website: {
      type: String,
      unique: false,
      required: true,
    },
    country: {
      type: String,
    },
    jobType: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    contact: {
      type: String,
    },
    additionalNotes: {
      type: String,
    },
    clientResponse: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

function validateGroup(genre) {
  const schema = Joi.object({
    companyName: Joi.string().min(5).max(50).required(),
    website: Joi.string().min(5).max(50).required(),
    country: Joi.string().min(1).max(50).required(),
    jobType: Joi.string().min(5).max(50).required(),
    linkedIn: Joi.string().min(5).max(50).required(),
    contact: Joi.string().min(5).max(50).required(),
    additionalNotes: Joi.string().min(5).max(50).required(),
    clientResponse: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
}
exports.validateEntity = validateGroup;
exports.entitySchema = entitySchema;
