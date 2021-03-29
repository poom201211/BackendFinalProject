// imports
const collection = require("../models/collectionsModel");
const pin = require("../models/pinModel");
const jwt = require("jsonwebtoken");

// Global variables
const KEY = "secretKey";

// Function for collection ID generation with 9 numbers
async function randomInt(low, high) {
  var createID = Math.floor(Math.random() * (high - low) + low);
  const unique = createID;
  const collectionResult = await collection
    .findOne({ collectionID: unique })
    .exec();
  if (collectionResult === null) {
    return unique;
  } else {
    return randomInt(low, high);
  }
}

// Create new collection from image, title, userId from userToken
exports.createNewCollection = async (req, res) => {
  try {
    let {
      collection_title,
      userToken,
      collection_icon,
      collection_color,
    } = req.body;

    var decodedToken = jwt.decode(userToken);
    var collection_id = await randomInt(100000000, 999999999);

    const newCollection = new collection({
      collectionID: collection_id,
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
    let { collectionObjectId, userToken } = req.body;
    var collectionResult = await collection.findById(collectionObjectId).exec();
    console.log(collectionResult);
    if (collectionResult === null) {
      return res.status(404).send({ message: "Collection not found" });
    } else {
      var decodedToken = jwt.decode(userToken);
      var collection_id = await randomInt(100000000, 999999999);
      const newCollection = new collection({
        collectionID: collection_id,
        collectionTitle: collectionResult.collectionTitle,
        user_id: decodedToken.id,
        collectionIcon: collectionResult.collectionIcon,
        collectionColor: collectionResult.collectionColor,
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
      collectionObjectId,
      userToken,
    } = req.body;
    var decodedToken = jwt.decode(userToken);
    var collectionResultObjectID = await collection
      .findById(collectionObjectId)
      .exec();
    console.log(collectionResultObjectID.user_id, decodedToken.id);

    if (!collectionResultObjectID.user_id == decodedToken.id) {
      return res.status(404).send({ message: "Collection and User not found" });
    } else {
      collection.findByIdAndUpdate(
        collectionObjectId,
        {
          collectionID: collectionResultObjectID.collectionID,
          collectionTitle: collection_title,
          collectionColor: collection_color,
          collectionIcon: collection_icon,
          user_id: collectionResultObjectID.user_id,
          kratoo_ids: collectionResultObjectID.kratoo_ids,
        },
        function (err, data) {
          if (err) return res.status(400).send({ message: error.message });

          console.log(data);
          return res.status(200).send();
        }
      );
      return res.status(200).json({ message: "Edit collection complete" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    let { collectionObjectId } = req.body;
    await collection.findByIdAndDelete(
      collectionObjectId,
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
  var collectionObjectId = req.params.collectionId;
  var collectionResult = await collection.findById(collectionObjectId).exec();
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
  try {
    var decodedToken = jwt.verify(token, KEY);
    var collectionUserId = decodedToken.id;
    var collectionResultUserId = await collection.findOne({user_id:collectionUserId}).exec();
    console.log(collectionResultUserId);
    console.log(decodedToken);
    if (!collectionResultUserId.user_id == decodedToken.id) {
      return res.status(401).send({ message: "User authentication failed" });
    } else {
      
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};
