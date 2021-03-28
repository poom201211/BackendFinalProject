// imports
const collection = require("../models/collectionsModel");
const jwt = require("jsonwebtoken");

// Create new collection from image, title, userId from userToken
exports.createNewCollection = (req, res) => {
  try {
    let { collection_image, collection_title, userToken } = req.body;
    var decodedToken = jwt.decode(userToken);
    const newCollection = new collection({
      collectionTitle: collection_title,
      user_id: decodedToken.id,
      collectionImage: collection_image,
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
        collectionImage: collectionResult.collectionImage,
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
      collection_image,
      collection_title,
      collectionId,
      userToken,
    } = req.body;
    var collectionResult = await collection.findById(collectionId).exec();
    console.log(collectionResult);
    if (collectionResult === null) {
      return res.status(404).send({ message: "Collection not found" });
    } else {
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
      var collection_image = collectionResult.collectionImage;
      var collection_title = collectionResult.collectionTitle;
    return res
      .status(200)
      .json({collection_image,collection_title});
  }
};
