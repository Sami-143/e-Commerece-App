const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");


//Create New Order
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    const { 
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(200).json({
        success:true,
        order
    });
});