'use strict';
// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const TodoSchema = new Schema({
    _index: {
        type: String,
        required: true,
      },
      _type: {
        type: String,
        required: true,
      },
      _version: {
        type: Number,
        required: true,
      },
      found: {
        type: Boolean,
        required: true,
      },
      _source: {
        type: Object,
        required: true,
        },
});

// create and export model
module.exports = mongoose.model("Kratoo", TodoSchema);
