const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Add CORS config at the top
app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend URL
  credentials: true               // Required to send cookies (JWT)
}));

app.use(express.json());
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
