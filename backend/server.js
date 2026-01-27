const app = require("./app");
const dotenv = require("dotenv");//simplifies the process of loading environment variables from a '. env' file into Node. js applications, reducing the need for manual configuration.
const connectDatabase = require("./config/database")
const nodemailer = require("nodemailer");

//Handling UnCaught Exception
process.on("uncaughtException",err=>{
    console.log(`Error message : ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1)
})


//Configuration
dotenv.config({path:"./config/config.env"});
connectDatabase();

async function testSMTP() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    transporter.verify((error) => {
        if (error) {
            console.error("❌ SMTP Connection Failed:", error);
        } else {
            console.log("✅ SMTP Connected Successfully");
        }
    });
}

testSMTP();

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