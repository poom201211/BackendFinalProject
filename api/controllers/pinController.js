// import pin Model
const pin = require("../models/pinModel");

exports.listPins = (req, res) => {
    pin.find({}, (err, todo) => {
        if (err) {
            res.status(500).send(err);
        }
        res.status(200).json(todo);
    });
};