const mongoose = require("mongoose");

const MONGODB_LOCAL_URI = "mongodb://localhost:27017/iTalk";
const dbConnect = async () => {
	try {
		const isConnected = await mongoose.connect(MONGODB_LOCAL_URI);
		if (!isConnected) throw new Error("could not connect to mongodb");
		console.log("connected to mongodb");
	} catch (error) {
		console.error(error);
	}
};

module.exports = dbConnect;
