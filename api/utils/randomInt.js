const Collection = require("../models/collectionsModel");

// Function for collection ID generation with 9 numbers
exports.randomInt = async (low, high) => {
    var createID = Math.floor(Math.random() * (high - low) + low);
    const unique = createID;
    const collectionResult = await Collection
      .findOne({ collectionID: unique })
      .exec();
    if (collectionResult === null) {
      return unique;
    } else {
      return randomInt(low, high);
    }
  };