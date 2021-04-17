// import pin Model
const Pin = require("../models/pinModel");

const sortPin = (a, b) => {
  if (a.postions.lat < b.postions.lat) {
    return -1;
  }
  if (a.postions.lat > b.postions.lat) {
    return 1;
  }
  if (a.postions.lng < b.postions.lng) {
    return -1;
  }
  if (a.postions.lng > b.postions.lng) {
    return 1;
  }
  return 0;
};

exports.types = (req, res) => {
  const { type, maxLat, maxLng, minLat, minLng } = req.query;

  const typeList = ["cafe", "attraction", "restaurant", "all"];

  if (!typeList.includes(type)) {
    return res.status(500).json({ message: "Invalid type" });
  }
  if (type === "all") {
    Pin.find({}, (err, pin) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        console.log(pin);
        const inZone = pin.filter(
          (p) =>
            p.postions.lat > parseFloat(minLat) &&
            p.postions.lat < parseFloat(maxLat) &&
            p.postions.lng > parseFloat(minLng) &&
            p.postions.lng < parseFloat(maxLng)
        );
        const pinsArray = [];
        let pinArray = [];
        inZone.sort(sortPin);
        inZone.forEach((pinInZone, index) => {
          if (index !== 0) {
            const prevPin = inZone[index - 1];
            if (
              prevPin.postions.lat !== pinInZone.postions.lat ||
              prevPin.postions.lng !== pinInZone.postions.lng
            ) {
              pinsArray.push(pinArray);
              pinArray = [];
            }
          }
          pinArray.push(pinInZone);
          if(index === inZone.length-1){
            pinsArray.push(pinArray); 
          }
        });
        console.log(pinsArray)
        return res.status(200).json(pinsArray);
      }
    });
  } else {
    Pin.find({ type: req.query.type }, (err, pin) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      } else {
        const inZone = pin.filter(
          (p) =>
            p.postions.lat > parseFloat(minLat) &&
            p.postions.lat < parseFloat(maxLat) &&
            p.postions.lng > parseFloat(minLng) &&
            p.postions.lng < parseFloat(maxLng)
        );
        const pinsArray = [];
        let pinArray = [];
        inZone.sort(sortPin);
        inZone.forEach((pinInZone, index) => {
          if (index !== 0) {
            const prevPin = inZone[index - 1];
            if (
              prevPin.postions.lat !== pinInZone.postions.lat ||
              prevPin.postions.lng !== pinInZone.postions.lng
            ) {
              pinsArray.push(pinArray);
              pinArray = [];
            }
          }
          pinArray.push(pinInZone);
          if(index === inZone.length-1){
            pinsArray.push(pinArray); 
          }
        });
        console.log(pinsArray)
        return res.status(200).json(pinsArray);
      }
    });
  }
};
