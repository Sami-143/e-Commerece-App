const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")


app.use(express.json());
app.use(cookieParser())

//Creating Api
const product = require("./routes/productsRoute");
const user = require("./routes/userRoute")
app.use("/api/v1",product);
app.use("/api/v1", user);



//use Middleware for Error
const errorMiddleware = require("./middleware/error")
app.use(errorMiddleware);

module.exports = app;