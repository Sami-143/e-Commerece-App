const express = require("express")
const product = require("./routes/productsRoute");
const errorMiddleware = require("./middleware/error")

const app = express();
app.use(express.json());

app.use("/api/v1",product);

//use Middleware for Error

app.use(errorMiddleware);

module.exports = app;