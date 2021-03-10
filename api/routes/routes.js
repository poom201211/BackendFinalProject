"use strict";

const userController = require("../controllers/userController");
const pinController = require("../controllers/pinController");

// create App function
module.exports = function (app) {

  // sign in
  app.route("/signIn").post(userController.signIn);

  // sign up
  app.route("/signUp").post(userController.signUp);

  // Pin routes

  // List all the 30 demo kratoo pins
  app.route("/pin").get(pinController.types);

};
