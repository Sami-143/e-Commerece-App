const app = require("./app");
const dotenv = require("dotenv");//simplifies the process of loading environment variables from a '. env' file into Node. js applications, reducing the need for manual configuration.
const connectDatabase = require("./config/database")

//Handling UnCaught Exception
process.on("uncaughtException",err=>{
    console.log(`Error message : ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1)
})


//Configuration
dotenv.config({path:"backend/config/config.env"});
connectDatabase();


//Connection Server
const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
});


//Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error message is ${err.message}`);
    console.log("Shutting down the server due to unhandled Promise rejection");
    server.close(()=>{
        process.exit(1)
    })
})