const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const isConnected = await mongoose.connect(
      "mongodb://localhost:27017/iTalk"
    );
    if (!isConnected) throw new Error("could not connect to mongodb");
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};

module.exports = dbConnect;
