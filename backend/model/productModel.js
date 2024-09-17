const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, "Please Enter the Name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please Enter the description"],
    },
    price: {
        type: Number,
        required: [true, "Please Enter the Price"],
        maxLength: [6, "Price should not exceed 6 characters"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String, // This was incorrectly set to `public_id: String`
                required: true,
            },
        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter the Category"],
    },
    Stock: {
        type: Number,
        required: [true, "Please Enter the Stock"],
        maxLength: [4, "Stock should not exceed 4 characters"],
        default: 1,
    },
    numOfReviews: {
        type: Number,  // Changed from String to Number
        default: 0,
    },
    review: [
        {
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            }
        }
    ],
    user:{
        type : mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Products", productSchema);
