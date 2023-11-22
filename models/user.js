const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const { userRoles } = require("../utils/constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
    },
    role: userRoles,
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

function validateUser(genre) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(2).max(50).required(),
    password: Joi.string().min(5).max(50).required(),
    image: Joi.string().min(1).max(50),
    isDeleted: Joi.boolean(),
    role: Joi.string().min(1).max(50),
    country: Joi.string().min(1).max(50).required(),
  });

  return schema.validate(genre);
}
exports.validate = validateUser;
exports.userSchema = userSchema;
