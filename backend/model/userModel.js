const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:[true,"Please enter the name"],
            maxLength:[30,"Please do not exceed the limit of 30 Characters"],
            minLength:[4,"Name should be more than 4 characters"],
        },
        email:{
            type:String,
            required:[true,"Please enter the email"],
            unique:true,
            validate:[validator.isEmail,"Please Enter the Valid Email"],
        },
        password:{
            type:String,
            required:[true,"Please enter the Password"],
            minLength:[8,"password should be more than 8 characters"],
            select:false,
        },
        avatars:{
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        },
        role:{
            type:String,
            default:"user",
        },

        resetPasswordToken:String,
        resetPasswordExpire:Date,
    }
)
module.exports = mongoose.model("User",userSchema)