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

const userRoute = require("./routes/userRoute");

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(compression());

// database connection
dbConnect();

// routes
app.use(userRoute);

// app
const port = process.env.port;
app.listen(port, () => {
  console.log(`application is listening on port ${port}`);
});
