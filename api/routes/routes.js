"use strict";

const userController = require("../controllers/userController");
const pinController = require("../controllers/pinController");
const collectionController = require("../controllers/collectionController");

// create App function
module.exports = function (app) {

  // sign in
  app.route("/signIn").post(userController.signIn);

  // sign up
  app.route("/signUp").post(userController.signUp);

  // Pin routes

  // List all the 30 demo kratoo pins
  app.route("/pin").get(pinController.types);


  // List of collection methods routes
  app.route("/create_new_collection").post(collectionController.createNewCollection);

  app.route("/copy_collection").post(collectionController.copyCollection);

  app.route("/edit_collection").put(collectionController.editCollection);

  app.route("/delete_collection").delete(collectionController.deleteCollection);

  app.route("/collection_detail/:collectionId").get(collectionController.getCollectionById);

};
