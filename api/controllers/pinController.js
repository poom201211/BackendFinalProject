// import pin Model
const Pin = require("../models/pinModel");

exports.types = (req, res) => {
  var type = req.query.type;

  const typeList = ["cafe", "attraction", "restaurant", "all"];

  if (!typeList.includes(type)) {
    return res.status(500).json({ message: "Invalid type" });
  }
  if (type === "all") {
    Pin.find({}, (err, pin) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        return res.status(200).json(pin);
      }
    });
  } else {
    Pin.find({ type: req.query.type }, (err, pin) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        return res.status(200).json(pin);
      }
    });
  }
};

exports.getKratooByKratooId = (req, res) => {
  const { kratooId } = req.params;

  Pin.findOne({ kratooID: kratooId }, (err, kratoo) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (!!!kratoo) {
      return res.status(500).json({ message: "Review not found" });
    }

    return res.status(200).json({ kratoo: kratoo });
  });
};
