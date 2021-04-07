// imports
const collection = require("../models/collectionsModel");
const pin = require("../models/pinModel");
const utils = require("../utils/randomInt");
const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const e = require("express");

// Global variables
const KEY = "secretKey";

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
    var collection_id = await utils.randomInt(100000000, 999999999);

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
    let { collection_id, userToken } = req.body;
    var collectionResult = await collection
      .findOne({ collectionID: collection_id })
      .exec();
    if (collectionResult === null) {
      return res.status(404).send({ message: "Collection not found" });
    } else {
      var decodedToken = jwt.decode(userToken);
      var collectionCreateId = await utils.randomInt(100000000, 999999999);
      const newCollection = new collection({
        collectionID: collectionCreateId,
        collectionTitle: collectionResult.collectionTitle,
        user_id: decodedToken.id,
        collectionIcon: collectionResult.collectionIcon,
        collectionColor: collectionResult.collectionColor,
        kratoo_ids: collectionResult.kratoo_ids,
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
      collection_id,
      userToken,
    } = req.body;
    var decodedToken = jwt.decode(userToken);
    var collectionResultID = await collection
      .findOne({ collectionID: collection_id })
      .exec();
    if (!collectionResultID.user_id == decodedToken.id) {
      return res.status(404).send({ message: "Collection and User not found" });
    } else {
      collection.findOneAndUpdate(
        { collectionID: collection_id },
        {
          collectionID: collectionResultID.collectionID,
          collectionTitle: collection_title,
          collectionColor: collection_color,
          collectionIcon: collection_icon,
          user_id: collectionResultID.user_id,
          kratoo_ids: collectionResultID.kratoo_ids,
        },
        function (err, data) {
          if (err) return res.status(400).send({ message: error.message });
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
    const { collection_id } = req.body;
    await collection.findOneAndDelete(
      { collectionID: collection_id },
      function (err, collection) {
        if (err) {
          console.log(err);
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
  var collection_id = req.params.collection_id;
  var collectionResult = await collection
    .findOne({ collectionID: collection_id })
    .exec();
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
    var userCollection = await collection
      .find({ user_id: decodedToken.id })
      .exec();
    const result = userCollection.map((record) => {
      const {
        collectionIcon,
        collectionColor,
        collectionTitle,
        collectionID,
        kratoo_ids,
      } = record;
      return {
        collectionIcon,
        collectionColor,
        collectionTitle,
        collectionID,
        kratooCount: kratoo_ids.length,
      };
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Get owner(username of collection owner) and list of kratoo in collection by collection id
exports.getCollection = async (req, res) => {
  try {
    var token = req.query.token;
    var collection_id = req.params.collection_id;
    var decodedToken = jwt.verify(token, KEY);
    var collectionResultId = await collection
      .findOne({ collectionID: collection_id })
      .exec();
    var ownerCollection = await user
      .findById(collectionResultId.user_id)
      .exec();

    const arrayKratooId = [];
    for (kratoo of collectionResultId.kratoo_ids) {
      var collectionKratooId = await pin.findOne({ kratooID: kratoo }).exec();
      var kratooTitle = collectionKratooId.kratooTitle;
      var kratooId = collectionKratooId.kratooID;
      arrayKratooId.push({ kratoo_title: kratooTitle, kratoo_id: kratooId });
    }

    if (collectionResultId != null) {
      var resultOwner = {
        owner: {
          username: ownerCollection.username,
          color: ownerCollection.user_color,
        },
        title: collectionResultId.collectionTitle,
        isOwner: String(collectionResultId.user_id) == String(decodedToken.id),
        blogs: arrayKratooId,
      };
      return res.status(200).json(resultOwner);
    } else {
      return res.status(401).send({ message: "User authentication fail" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Add kratoo to collection
exports.addKratooToCollection = async (req, res) => {
  try {
    let { kratoo_id, collection_id } = req.body;
    let arrayOfCollection = collection_id.split(",");

    arrayOfCollection.forEach((collectionid) => {
      collection
        .updateOne(
          { collectionID: collectionid },
          {
            $addToSet: {
              kratoo_ids: kratoo_id,
            },
          }
        )
        .exec();
    });
    return res
      .status(200)
      .json({ message: "Kratoo has been added to all the collections" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

// Update kratoo in collection
exports.updateKratooToCollection = async (req, res) => {
  try {
    let { kratoo_id, collection_ids } = req.body;

    let arrayOfCollection = collection_ids.split(",");
    for (collectionId of arrayOfCollection) {
      var collectionID = await collection
        .findOne({ collectionID: collectionId })
        .exec();
      var collectionCheck = collectionID.kratoo_ids.indexOf(kratoo_id);
      if (collectionCheck == -1) {
        collectionID.kratoo_ids.push(kratoo_id);
        collectionID.save();
      } else {
        collectionID.kratoo_ids.splice(collectionCheck, 1);
        collectionID.save();
      }
    }
    return res.status(200).send({ message: "Collection updated" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};

exports.getCollectionByKratooId = async (req, res) => {
  try {
    const { kratooId } = req.params;
    const { token } = req.query;

    const decodedToken = jwt.verify(token, KEY);
    const userId = decodedToken.id;

    collection.find({ user_id: userId }, (err, collectionResults) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      const favoriteCollection = [];
      let checkFavorite = false;
      collectionResults.forEach((collectionResult) => {
        if (collectionResult.kratoo_ids.indexOf(kratooId) !== -1) {
          favoriteCollection.push({
            collection: collectionResult,
            isFavorite: true,
          });
          checkFavorite = true;
        } else {
          favoriteCollection.push({
            collection: collectionResult,
            isFavorite: false,
          });
        }
      });
      return res.status(200).send({
        collections: favoriteCollection,
        checkFavorite: checkFavorite,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
  }
};
