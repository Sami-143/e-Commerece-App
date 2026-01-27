const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // <-- IMPORTANT
app.use(cookieParser());

// Import Routes
const product = require("./routes/productsRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

// Use Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// Error Middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
