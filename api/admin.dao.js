const mongoose = require("mongoose");
const adminSchema = require("./admin.model");
const { encryptPass } = require("../helpers/bcrypt");

adminSchema.statics = {
  create: function (data, cb) {
    data.password = encryptPass(data.password);
    const admin = new this(data);
    admin.save(cb);
  },

  get: function (query, cb) {
    this.find(query, cb);
  },

  getByName: function (query, cb) {
    this.find(query, cb);
  },

  update: function (query, updateData, cb) {
    updateData.password = encryptPass(updateData.password);
    this.findOneAndUpdate(query, { $set: updateData }, { new: true }, cb);
  },

  delete: function (query, cb) {
    this.findOneAndDelete(query, cb);
  },
};

const adminModel = mongoose.model("Admins", adminSchema);
module.exports = adminModel;
