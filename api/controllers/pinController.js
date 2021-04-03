// import pin Model
const pin = require("../models/pinModel");

exports.types = (req, res) => {
  var type = req.query.type;

  const typeList = ["cafe", "attraction", "restaurant", "all"];

  if (!typeList.includes(type)) {
    return res.status(500).json({ message: "Invalid type" });
  }
  if (type === "all") {
    pin.find({}, (err, pin) => {
      if(err){
        return res.status(500).json({ message: err.message });
      }else{
        return res.status(200).json(pin);
      }
    }
    );
  } else {
    pin.find({ type: req.query.type }, (err, pin) => {
      if(err){
        return res.status(500).json({ message: err.message });
      }else{
        return res.status(200).json(pin);
      }
    });
  }
};
