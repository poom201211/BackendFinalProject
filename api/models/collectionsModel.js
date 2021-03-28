'use strict';
// Import mongoose
const mongoose = require("mongoose");

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
const CollectionSchema = new Schema({
    collectionTitle: {
        type: String,
        required: true
    },
    collectionImage: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    kratoo_ids: {
        type: [Number],
        required: true
    }
});

// create and export model
module.exports = mongoose.model("Collections", CollectionSchema);