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
const path = require("path");
const fs = require("fs");

const { setMessageSocket } = require("./controllers/messageController");
// socket setup
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// database connection
dbConnect();

// Catch unhandled errors
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled Promise Rejection:", error.message);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credential: true,
  },
});

setMessageSocket(io);

// 🔥 socket.on("connection")
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// routes
app.use(userRoute);
app.use(messageRoute);

// swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//  Catch undefined routes
app.use((req, res) => {
  console.error("Routing error:", req.originalUrl);
  res.status(500).json({ message: "Routing error" });
});

// app
const port = process.env.port || 8000;

try {
  server.listen(port, () => {
    console.log(`Application is listening on port ${port}`);
  });
} catch (error) {
  console.log("Server startup error:", error);
}
