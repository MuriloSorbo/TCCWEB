const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const operationsLogSchema = new Schema(
  {
    opName: { type: String, required: true },
    dateTime: { type: Date, required: true },
    grain: { type: String, required: true },
    temp: { type: Number, required: true },
    hum: { type: Number, required: true },
    humAir: { type: Number, required: true },
    PH: { type: Number, required: true },
    ElectricalConductivity: { type: Number, required: true },
    geo: { type: String, required: true },
  },
  { timestamps: false }
);

module.exports = operationsLogSchema;
