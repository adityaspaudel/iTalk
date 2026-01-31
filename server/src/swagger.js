// src/swagger.js
const swaggerAutogen = require("swagger-autogen")();

const doc = {
	info: {
		title: "Chat App API",
		description: "Auto-generated Swagger documentation",
	},
	host: "localhost:8000",
	schemes: ["http"],
};

const outputFile = "./swagger-output.json";

//  All my routes go here (no need for comments inside route files)
const endpointsFiles = [
	"./routes/userRoute.js",
	// "./routes/messageRoute.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
	console.log("📘 Swagger JSON generated automatically!");
});
