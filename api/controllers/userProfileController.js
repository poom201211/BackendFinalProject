const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const ROUND = 10;
const KEY = "secretKey";

exports.getUser = (request, response) => {
  const { userToken } = request.params;
  try {
    const userData = jwt.verify(userToken, KEY);

    User.findOne({ _id: userData.id }, (error, user) => {
      if (error) {
        return response.status(500).json({ message: error.message });
      }
      const responseUser = {
        username: user.username,
        email: user.email,
        user_color: user.user_color,
      };
      return response.status(200).json({ user: responseUser });
    });
  } catch (err) {
    return response.status(401).json({ message: "invalid secret key" });
  }
};

exports.updateUser = (request, response) => {
  const { userToken } = request.params;
  try {
    const userData = jwt.verify(userToken, KEY);

    User.findOneAndUpdate(
      { _id: userData.id },
      request.body,
      { new: true },
      (error, user) => {
        if (error) {
          return response.status(500).json({ message: error.message });
        }
        const userSign = {
          id: user._id,
          username: user.username,
        };

        // encode to jwt format
        const authToken = jwt.sign(userSign, KEY);
        return response.status(200).json({ authToken: authToken });
      }
    );
  } catch (err) {
    return response.status(401).json({ message: "invalid user" });
  }
};

exports.updatePassword = (request, response) => {
  const { userToken } = request.params;
  const { oldPassword, newPassword } = request.body;
  try {
    const userData = jwt.verify(userToken, KEY);
    User.findOne({ _id: userData.id }, (error, user) => {
      if (error) {
        return response.status(500).json({ message: error.message });
      }
      // Compare password to password in database
      const checkedPassword = bcrypt.compareSync(oldPassword, user.password);

      if (!checkedPassword) {
        return response.status(401).json({ message: "incorrect password" });
      }
      const hashedPassword = bcrypt.hashSync(newPassword, ROUND);
      User.findOneAndUpdate(
        { _id: userData.id },
        { password: hashedPassword },
        { new: true },
        (updateError, updatedUser) => {
          if (error) {
            return response.status(500).json({ message: updateError.message });
          }
          return response.status(200).json({ message: "update success" });
        }
      );
    });
  } catch (err) {
    return response.status(401).json({ message: "invalid user" });
  }
};
