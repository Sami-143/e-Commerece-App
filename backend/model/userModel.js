const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:[true,"Please enter the name"],
            maxLength:[30,"Please do not exceed the limit of 30 Characters"],
            minLength:[4,"Name should be more than 4 characters"],
            
        }
    }
)