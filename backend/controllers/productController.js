const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");

const mongoose = require("mongoose");

//Create A Product ---Admin Pannel
exports.createProucts = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product

    })
}

//Getting the Products -- 
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
}

//Getting A Product
exports.gettingProductDetails = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
};



//Updating the Product
exports.updateProducts = async (req, res) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        product
    });

}

//Deleting the Product
exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        });
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted Successfully"
    });
};