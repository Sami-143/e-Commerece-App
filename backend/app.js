const express = require("express")
const product = require("./routes/productsRoute");
const user = require("./routes/userRoute")
const app = express();
const errorMiddleware = require("./middleware/error")

app.use(express.json());


app.use("/api/v1",product);
app.use("/api/v1",user);


//use Middleware for Error
app.use(errorMiddleware);

module.exports = app;