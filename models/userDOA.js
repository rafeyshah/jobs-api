const mongoose = require("mongoose");
const { userSchema } = require("./user");

userSchema.statics = {
  create: async function (data) {
    const work = new this(data);
    await work.save();
  },

  get: async function (query) {
    await this.find(query);
  },

  getByName: async function (query) {
    await this.find(query);
  },
};

const workModel = mongoose.model("users", userSchema);
module.exports = workModel;
