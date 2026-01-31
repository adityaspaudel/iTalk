const mongoose = require("mongoose");

const MONGODB_LOCAL_URI = "mongodb://localhost:27017/iTalk";
const MONGODB_ATLAS_URI =
	process.env.MONGODB_ATLAS_URI ||
	"mongodb+srv://iTalkMessage:iTalkMessage@cluster0.lfmy0l9.mongodb.net/?appName=Cluster0";
const dbConnect = async () => {
	try {
		const isConnected = await mongoose.connect(MONGODB_ATLAS_URI);
		if (!isConnected) throw new Error("could not connect to mongodb");
		console.log(`connected to mongodb, ${MONGODB_ATLAS_URI}`);
	} catch (error) {
		console.error(error);
	}
};

module.exports = dbConnect;
