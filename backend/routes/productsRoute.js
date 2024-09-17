const express = require("express");

const { getAllProducts,
    createProucts,
    updateProducts,
    deleteProduct,
    gettingProductDetails } = require("../controllers/productController");

const { isAuthenticatedUser,authorizedRoles } = require("../middleware/auth.js")
const router = express.Router();

router.route("/products").get(getAllProducts); // Define the route

router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"), createProucts);//Create A Product Route

router
    .route("/product/:id")
    .put(isAuthenticatedUser,authorizedRoles("admin"), updateProducts)
    .delete(isAuthenticatedUser,authorizedRoles("admin"), deleteProduct)
    .get(gettingProductDetails);//Update a product//delete a product

module.exports = router; // Export the router

