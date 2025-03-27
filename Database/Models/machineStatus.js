const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const machineStatusSchema = new Schema(
  {
    connected: { type: Boolean, required: true },
    inOperation: { type: Boolean, required: true },
    operationName: { type: String, required: false },
    machineName: { type: String, required: false },
    lstTemp: { type: Number, required: true },
    lstHum: { type: Number, required: true },
    lstHumAir: { type: Number, required: true },
    lstPH: { type: Number, required: true },
    lstElectricalCondictivity: { type: Number, required: true },
    lstGeo: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = machineStatusSchema;
