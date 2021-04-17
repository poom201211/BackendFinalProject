'use strict';
// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const ContentSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    _source: {
        type: Object,
        required: true
    }
});

// create and export model
module.exports = mongoose.model("Contents", ContentSchema);