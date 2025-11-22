const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the name"],
        maxLength: [30, "Please do not exceed the limit of 30 Characters"],
        minLength: [4, "Name should be more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter the email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter the Valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please enter the Password"],
        minLength: [8, "password should be more than 8 characters"],
        select: false,
    },
    avatars: {
        public_id: {
            type: String,
            required: false,
            default: "sample_public_id"
        },
        url: {
            type: String,
            required: false,
            default: "https://example.com/default-avatar.png"
        },
    },

    role: {
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
}
)
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//Authentication Token
//jwt.sign(payload, secret, options)
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");//generate random token using crypto module //randomBytes() method generates a cryptographically strong pseudo-random data. and toString("hex") converts it to hexadecimal format
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");//create a hash of the token and store it in the resetPasswordToken field and sha256 is used to hash the token and digest("hex") is used to convert it to hexadecimal format
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model("User", userSchema)