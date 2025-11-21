const express = require("express");
const app = express();
const dbConnect = require("./db/connection");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: "" });
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");

// swagger api setup
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output.json"); // auto-generated file

const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(compression());

// database connection
dbConnect();

// Catch unhandled errors
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Promise Rejection:", error.message);
});

// routes
app.use(userRoute);
app.use(messageRoute);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//  Catch undefined routes
app.use((req, res) => {
  console.log("Route not found:", req);
  res.status(404).json({ message: "Route not found" });
});

// app
const port = process.env.port || 8000;

try {
  app.listen(port, () => {
    console.log(`Application is listening on port ${port}`);
  });
} catch (error) {
  console.log("Server startup error:", error);
}
