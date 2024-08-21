const Product = require("../model/productModel");


//Create A Product ---Admin Pannel
exports.createProucts = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product

    })
}

//Getting the Product -- 
exports.getAllProducts = async (req, res) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
}

exports.updateProducts = async(req,res)=>{
    const update = await Product.findById();
    res.status(500).json({
        success:true,
        update
    })
}

