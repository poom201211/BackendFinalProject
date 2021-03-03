const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const ROUND = 10;
const KEY = "secretKey";

// sign in
exports.signIn = (request, response) => {
  const { email, password } = request.body;

  // find user in database
  User.findOne({ email: email }, (error, user) => {
    // Database error
    if (error) {
      response.status(500).json({ message: error.message });
    }

    // Invalid email
    if (!user) {
      response.status(401).json({ message: "invalid email" });
    }

    try {
      // Compare password to password in database
      const checkedPassword = bcrypt.compareSync(password, user.password);

      if (!checkedPassword) {
        response.status(401).json({ message: "incorrect password" });
      }

      const userSign = {
        id: user._id,
        username: user.username,
      };

      // encode to jwt format
      const authToken = jwt.sign(userSign, KEY);
      response.status(200).json({ authToken: authToken });
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
  });
};

exports.signUp = (request, response) => {
  const { email, password, username } = request.body;

  User.findOne({ email: email }, (error, user) => {
    if (error) {
      response.status(500).json({ message: error.message });
    }

    if (user) {
      response.status(401).json({ message: "Email is already used" });
    }

    let hashedPassword;

    try {
      // hash password before store in database
      hashedPassword = bcrypt.hashSync(password, ROUND);
    } catch (error) {
      response.status(500).json({ message: error.message });
    }
    const newUser = new User({
      email: email,
      password: hashedPassword,
      username: username,
    });
    newUser.save((error, user) => {
      if (error) {
        response.status(500).json({ message: error.message });
      }
      try {
        const userSign = {
          id: user._id,
          username: user.username,
        };
        // encode to jwt format
        const authToken = jwt.sign(userSign, KEY);
        response.status(200).json({ authToken: authToken });
      } catch (error) {
        response.status(500).json({ message: error.message });
      }
    });
  });
};
