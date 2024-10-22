const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const mongoose = require("mongoose");
const ApiFeatures = require("../utils/apifeatures");


//Create A Product ---Admin Pannel
exports.createProucts = catchAsyncError(async (req, res, next) => {

    req.user.body = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product

    })
});

//Getting the Products --

exports.getAllProducts = catchAsyncError(async (req, res) => {

    const resultPerPage = 5;
    const productCount = await Product.countDocuments();//will use for the Frontend

    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);

    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    })
});

//Getting A Product
exports.gettingProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});



//Updating the Product
exports.updateProducts = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });

});

//Deleting the Product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
});