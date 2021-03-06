'use strict';
// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const PinSchema = new Schema({
    kratooID: {
        type: Number,
        required: true
    },
    kratooTitle: {
        type: String,
        required: true
    },
    kratooDesc: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    postions: {
        type: Object,
        required: false
    },    
    nickname: {
        type: String,
        required: true
    },
    created_time: {
        type: String,
        required: true
    },
    emotion: {
        type: Object,
        required: true
    }
});

// create and export model
module.exports = mongoose.model("Pins", PinSchema);