const express = require("express");
const { getAllProducts,
        createProucts,
        updateProducts,
        deleteProduct,
        gettingProductDetails }= require("../controllers/productController");

const {isAuthenticatedUser} = require("../middleware/auth.js")
const router = express.Router(); // Correctly create a router instance

router.route("/products").get(isAuthenticatedUser,getAllProducts); // Define the route
router.route("/product/new").post(createProucts);//Create A Product Route
router.route("/product/:id").put(updateProducts).delete(deleteProduct).get(gettingProductDetails);//Update a product//delete a product

module.exports = router; // Export the router

