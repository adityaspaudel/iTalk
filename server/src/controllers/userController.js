const User = require("../models/userModel");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// user registration
const userRegistration = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      res.send({ message: "all field are required" });
    }
    const findUserByUsername = await User.findOne({ username });
    const findUserByEmail = await User.findOne({ email });
    if (findUserByUsername || findUserByEmail) {
      res.send({ message: "User already exists" });
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });
    const payload = {
      user: {
        id: newUser._id, // Use the MongoDB object ID
        username: newUser.username,
        email: newUser.email,
      },
    };
    const token = jwt.sign(payload, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "user registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

// user login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "all field are required" });
    }
    const findUserByEmail = await User.find({ email }).select("+password");
    if (!findUserByEmail) {
      res.status(404).send({ message: "user doesn`t exist" });
    }
    const token = jwt.sign(
      { id: findUserByEmail._id },
      process.env.jwt_secret,
      {
        expiresIn: "7d",
      }
    );
    res.json({
      msg: "Login successful",
      token,
      user: { id: findUserByEmail._id, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};
module.exports = { userRegistration, userLogin };
