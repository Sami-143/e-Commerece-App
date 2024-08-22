const app = require("./app");
const dotenv = require("dotenv");//simplifies the process of loading environment variables from a '. env' file into Node. js applications, reducing the need for manual configuration.
const connectDatabase = require("./config/database")
//Config

dotenv.config({path:"backend/config/config.env"});
connectDatabase();



app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});