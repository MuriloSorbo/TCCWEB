const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const operationsListSchema = new Schema(
  {
    opName: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  { timestamps: false }
);

module.exports = operationsListSchema;