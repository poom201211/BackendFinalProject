// import pin Model
const pin = require("../models/pinModel");

exports.types = (req, res) => {
  var type = req.query.type;

  const typeList = ["cafe", "attraction", "restaurant", "all"];

  if (!typeList.includes(type)) {
    return response.status(500).json({ message: "Invalid type" });
  }
  if (type === "all") {
    pin.find({}, (err, pin) => {
      res.status(200).json(pin);
    });
  } else {
    pin.find({ type: req.query.type }, (err, pin) => {
      res.status(200).json(pin);
    });
  }
};
