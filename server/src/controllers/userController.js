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
    const findUserByEmail = await User.findOne({ email }).select("+password");
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
      message: "Login successful",
      token,
      user: { id: findUserByEmail._id, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

const userSearchByName = async (req, res) => {
  try {
    const { fullName } = req.query;
    if (!fullName || fullName.trim() === "") {
      res.send({ message: "please type something" });
    }

    const users = await User.find({
      fullName: { $regex: fullName, $options: "i" },
    }).select("-password"); // remove password field

    res.status(200).json({
      results: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {}
};

const toggleFollowUnfollow = async (req, res) => {
  try {
    const { followedBy, followingTo } = req.body;

    // prevent self-follow
    if (followedBy === followingTo) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    // validate
    if (!followedBy || !followingTo) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    // find both users
    const currentUser = await User.findById(followedBy);
    const targetUser = await User.findById(followingTo);

    // user existence check
    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User(s) not found" });
    }

    // check following status
    const isFollowing = currentUser.following
      .map((id) => id.toString())
      .includes(followingTo.toString());

    if (isFollowing) {
      // unfollow
      currentUser.following.pull(followingTo);
      targetUser.followers.pull(followedBy);
    } else {
      // follow
      currentUser.following.push(followingTo);
      targetUser.followers.push(followedBy);
    }

    await currentUser.save();
    await targetUser.save();

    return res.json({
      message: isFollowing
        ? "Unfollowed successfully"
        : "Followed successfully",
    });
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  userRegistration,
  userLogin,
  userSearchByName,
  fetchAllUsers,
  toggleFollowUnfollow,
};
