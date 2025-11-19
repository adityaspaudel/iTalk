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

    const newUser = new User({ fullName, username, email });
    res.status(200).send({ newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = { userRegistration };
