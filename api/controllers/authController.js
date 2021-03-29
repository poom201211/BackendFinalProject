const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const ROUND = 10;
const KEY = "secretKey";

// sign in
exports.signIn = (request, response) => {
  const { email, password } = request.body;

  // find user in database
  User.findOne({ email: email }, (error, user) => {
    // Database error
    if (error) {
      return response.status(500).json({ message: error.message });
    }

    // Invalid email
    if (!user) {
        return response.status(401).json({ message: "invalid email" });
    }
    try {
      // Compare password to password in database
      const checkedPassword = bcrypt.compareSync(password, user.password);

      if (!checkedPassword) {
        return response.status(401).json({ message: "incorrect password" });
      }
      const userSign = {
        id: user._id,
        username: user.username,
      };

      // encode to jwt format
      const authToken = jwt.sign(userSign, KEY);
      return response.status(200).json({ authToken: authToken });
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
  });
};

exports.signUp = (request, response) => {
  const { email, password, username } = request.body;

  User.findOne({ email: email }, (error, user) => {
    if (error) {
        return response.status(500).json({ message: error.message });
    }

    if (user) {
        return response.status(401).json({ message: "Email is already used" });
    }

    let hashedPassword;

    try {
      // hash password before store in database
      hashedPassword = bcrypt.hashSync(password, ROUND);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
    const newUser = new User({
      email: email,
      password: hashedPassword,
      username: username,
      user_color: '#ffffff'
    });
    newUser.save((error, user) => {
      if (error) {
        return response.status(500).json({ message: error.message });
      }
      try {
        const userSign = {
          id: user._id,
          username: user.username,
        };
        // encode to jwt format
        const authToken = jwt.sign(userSign, KEY);
        return response.status(200).json({ authToken: authToken });
      } catch (error) {
        return response.status(500).json({ message: error.message });
      }
    });
  });
};
