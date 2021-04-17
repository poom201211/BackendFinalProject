"use strict";

const authController = require("../controllers/authController");
const pinController = require("../controllers/pinController");
const userProfileController = require("../controllers/userProfileController");
const collectionController = require("../controllers/collectionController");
const contentController = require("../controllers/contentController")

// create App function
module.exports = function (app) {
  // sign in
  app.route("/signIn").post(authController.signIn);

  // sign up
  app.route("/signUp").post(authController.signUp);

  app
    .route("/user/:userToken")
    .get(userProfileController.getUser)
    .patch(userProfileController.updateUser);

  app
    .route("/user/:userToken/password")
    .patch(userProfileController.updatePassword);

  // Pin routes
  app.route("/pin").get(pinController.types);

  // Content routes
  app.route("/kratoo/:kratooId").get(contentController.userContent);
  app.route("/load_data").get(contentController.convertContentToPin);

  // List of collection methods routes
  app
    .route("/create_new_collection")
    .post(collectionController.createNewCollection);

  app.route("/copy_collection").post(collectionController.copyCollection);

  app.route("/edit_collection").put(collectionController.editCollection);

  app.route("/delete_collection").delete(collectionController.deleteCollection);

  app
    .route("/collection_detail/:collection_id")
    .get(collectionController.getCollectionById);

  app.route("/collections").get(collectionController.getListUserCollection);

  app
    .route("/collection/:collection_id")
    .get(collectionController.getCollection);

  app.route('/collection/kratoo/:kratooId').get(collectionController.getCollectionByKratooId)

  app
    .route("/add_to_collection")
    .post(collectionController.addKratooToCollection);

  app
    .route("/update_to_collection")
    .put(collectionController.updateKratooToCollection);

};
