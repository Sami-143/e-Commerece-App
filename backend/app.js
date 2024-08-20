const express = require("express")
const product = require("./routes/productsRoute");

const app = express();

app.use(express.json());
app.use("/api/v1",product);


module.exports = app;