const mongoose = require("mongoose");
const { entitySchema } = require("./entity");

entitySchema.statics = {
  create: async function (data) {
    const work = new this(data);
    await work.save();
  },

  get: async function (query) {
    await this.find(query);
  },

  update: async function (query, updateData) {
    await this.findOneAndUpdate(query, { $set: updateData }, { new: true });
  },

  delete: async function (query) {
    await this.findOneAndDelete(query);
  },

  getCountries: async function (query) {
    await this.find(query);
  },

  upload: async function (sample) {
    console.log("Uploading... ", sample);
  },

  getCountries: async function (query) {
    await this.find(query);
  },
};

const entityModel = mongoose.model("entity", entitySchema);
module.exports = entityModel;
