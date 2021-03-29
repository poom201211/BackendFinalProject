// imports
const collection = require("../models/collectionsModel");
const pin = require("../models/pinModel");
const jwt = require("jsonwebtoken");

// Function for collection ID generation

// Create new collection from image, title, userId from userToken
exports.createNewCollection = (req, res) => {
  try {
    let {
      collection_title,
      userToken,
      collection_icon,
      collection_color
    } = req.body;
    var decodedToken = jwt.decode(userToken);
    const newCollection = new collection({
      collectionTitle: collection_title,
      user_id: decodedToken.id,
      collectionIcon: collection_icon,
      collectionColor: collection_color,
    });
    newCollection.save();
    return res.status(200).json({ message: "New collection created" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// create new collection from the existed collection [ owned by another user ] [from collection id]
exports.copyCollection = async (req, res) => {
  try {
    let { collectionId, userToken } = req.body;
    var collectionResult = await collection.findById(collectionId).exec();
    console.log(collectionResult);
    if (collectionResult === null) {
      return res.status(404).send({ message: "Collection not found" });
    } else {
      var decodedToken = jwt.decode(userToken);
      const newCollection = new collection({
        collectionTitle: collectionResult.collectionTitle,
        user_id: decodedToken.id,
        collectionIcon: collectionResult.collectionIcon,
        collectionColor: collectionResult.collectionColor
      });
      newCollection.save();
      return res.status(200).json({ message: "Collection copied to new user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Edit collection
exports.editCollection = async (req, res) => {
  try {
    let {
      collection_icon,
      collection_color,
      collection_title,
      collectionId,
      userToken,
    } = req.body;
    var collectionResult = await collection.findById(collectionId).exec();
    console.log(collectionResult);
    if (collectionResult === null) {
      return res.status(404).send({ message: "Collection not found" });
    } else {
      collection.updateMany(collectionResult.collectionColor,collectionResult.collectionIcon);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    let { collectionId } = req.body;
    await collection.findByIdAndDelete(
      collectionId,
      function (err, collection) {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted collection: ", collection);
        }
      }
    );
    return res.status(200).json({ message: "Collection deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Get collection detail from collection id
exports.getCollectionById = async (req, res) => {
  var collectionId = req.params.collectionId;
  var collectionResult = await collection.findById(collectionId).exec();
  console.log(collectionResult);
  if (collectionResult === null) {
    return res.status(404).send({ message: "Collection not found" });
  } else {
    var collection_icon = collectionResult.collectionIcon;
    var collection_color = collectionResult.collectionColor;
    var collection_title = collectionResult.collectionTitle;
    return res
      .status(200)
      .json({ collection_icon, collection_color, collection_title });
  }
};

// Get list of collection by id in userToken
exports.getListUserCollection = async (req, res) => {
  var token = req.query.token;
};
