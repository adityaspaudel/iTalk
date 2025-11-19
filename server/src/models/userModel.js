const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = model("User", userSchema);
module.exports = User;
