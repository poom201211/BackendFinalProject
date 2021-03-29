"use strict";

const authController = require("../controllers/authController");
const pinController = require("../controllers/pinController");
const userProfileController = require("../controllers/userProfileController");

// create App function
module.exports = function (app) {

  // sign in
  app.route("/signIn").post(authController.signIn);

  // sign up
  app.route("/signUp").post(authController.signUp);

  app.route("/user/:userToken").get(userProfileController.getUser).patch(userProfileController.updateUser);

  app.route("/user/:userToken/password").patch(userProfileController.updatePassword)

  // Pin routes

  // List all the 30 demo kratoo pins
  app.route("/pin").get(pinController.types);

};
