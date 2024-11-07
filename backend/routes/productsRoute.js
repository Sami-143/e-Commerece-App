const express = require("express");

const { getAllProducts,
    createProducts,
    updateProducts,
    deleteProduct,
    gettingProductDetails,
    createProductReview } = require("../controllers/productController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth.js")
const router = express.Router();

router.route("/products").get(getAllProducts); // Define the route

router.
    route("/admin/product/new")
    .post(isAuthenticatedUser, authorizedRoles("admin"), createProducts);//Create A Product Route

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"), updateProducts)
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct)
    //Update a product//delete a product

router.route("/product/:id").get(gettingProductDetails); // Get the product details

router.route('/review').put(isAuthenticatedUser, createProductReview); // Create a review


module.exports = router; // Export the router

