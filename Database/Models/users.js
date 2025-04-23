const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    accessCode: { type: String, required: true },
    machineCodes: [ { type: String } ]
  },
);

module.exports = usersSchema;