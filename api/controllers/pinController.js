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
        var result = pin.map((onePin) => {
          var resultPin = {
            kratooTitle: onePin.kratooTitle,
            type: onePin.type,
            positions: onePin.postions,
            created_time: onePin.created_time,
            emotion: onePin.emotion,
          };
          return resultPin
        })
        
        return res.status(200).json(result);
      }
    });
  } else {
    Pin.find({ type: req.query.type }, (err, pin) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        var result = pin.map((onePin) => {
          var resultPin = {
            kratooTitle: onePin.kratooTitle,
            type: onePin.type,
            positions: onePin.postions,
            created_time: onePin.created_time,
            emotion: onePin.emotion,
          };
          return resultPin
        })
        return res.status(200).json(result);
      }
    });
  }
};
