const express = require("express");

const { getAllProducts,
    createProucts,
    updateProducts,
    deleteProduct,
    gettingProductDetails } = require("../controllers/productController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth.js")
const router = express.Router();

router.route("/products").get(getAllProducts); // Define the route

router.
    route("/admin/product/new")
    .post(isAuthenticatedUser, authorizedRoles("admin"), createProucts);//Create A Product Route

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateProducts)
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct)
    //Update a product//delete a product

router.route("/product/:id").get(gettingProductDetails); // Get the product details

module.exports = router; // Export the router

