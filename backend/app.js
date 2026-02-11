const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true 
}));

// Body parsers - increased limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Import Routes
const product = require("./routes/productsRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const chat = require("./routes/chatRoute");
const admin = require("./routes/adminRoute");

// Use Routes
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", chat);
app.use("/api/v1", admin);

// Error Middleware
const errorMiddleware = require("./middleware/error");
app.use(errorMiddleware);

module.exports = app;
