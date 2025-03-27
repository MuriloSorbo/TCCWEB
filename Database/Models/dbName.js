const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dbNameSchema = new Schema(
  {
    dbName: { type: String, required: true },
    accessCode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = dbNameSchema;