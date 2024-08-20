const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect("mongodb://localhost:27017/Ecommerce")
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
};

module.exports = connectDatabase;
