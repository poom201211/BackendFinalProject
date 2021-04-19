// import pin Model
const pinModel = require("../models/pinModel");
const Pin = require("../models/pinModel");

exports.types = (req, res) => {
  const { type, maxLat, maxLng, minLat, minLng } = req.query;

  const typeList = ["cafe", "attraction", "restaurant", "all"];

  if (!typeList.includes(type)) {
    return res.status(500).json({ message: "Invalid type" });
  }
  if (type === "all") {
    Pin.find(
      {
        "postions.lat": { $gt: parseFloat(minLat), $lt: parseFloat(maxLat) },
        "postions.lng": { $gt: parseFloat(minLng), $lt: parseFloat(maxLng) },
      },
      (err, pin) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          const pinsArray = [];
          let pinArray = [];
          pin.forEach((pinInZone, index) => {
            if (index !== 0) {
              const prevPin = pin[index - 1];
              if (
                prevPin.postions?.lat !== pinInZone.postions?.lat ||
                prevPin.postions?.lng !== pinInZone.postions?.lng
              ) {
                pinsArray.push(pinArray);
                pinArray = [];
              }
              pinArray.push(pinInZone);
              if (index === pin.length - 1) {
                pinsArray.push(pinArray);
              }
            }
          });
          return res.status(200).json(pinsArray);
        }
      }
    );
  } else {
    Pin.find(
      {
        type: req.query.type,
        "postions.lat": { $gt: parseFloat(minLat), $lt: parseFloat(maxLat) },
        "postions.lng": { $gt: parseFloat(minLng), $lt: parseFloat(maxLng) },
      },
      (err, pin) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        } else {
          const pinsArray = [];
          let pinArray = [];
          pin.forEach((pinInZone, index) => {
            if (index !== 0) {
              const prevPin = pin[index - 1];
              if (
                prevPin.postions?.lat !== pinInZone.postions?.lat ||
                prevPin.postions?.lng !== pinInZone.postions?.lng
              ) {
                pinsArray.push(pinArray);
                pinArray = [];
              }
            }
            pinArray.push(pinInZone);
            if (index === pin.length - 1) {
              pinsArray.push(pinArray);
            }
          });
          return res.status(200).json(pinsArray);
        }
      }
    );
  }
};

exports.getKratoo = (req, res) => {
  const { kratooId } = req.params;
  Pin.findOne({ kratooID: kratooId }, (err, kratoo) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(200).json({ kratoo: kratoo });
    }
  });
};
