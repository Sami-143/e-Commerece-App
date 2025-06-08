import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import Navbar from "../Navbar";
import bgProduct from '../../../assets/shopping-cart.jpeg'; // use same or your own background

const defaultProducts = [
  {
    name: "Cornflakes",
    description: "Crispy and delicious cornflakes to start your day.",
    images:
      "https://media.istockphoto.com/id/515167475/photo/corn-flakes-with-milk-breakfast.jpg?s=2048x2048&w=is&k=20&c=ZNLdff630mtq2Vd4CDR9Qloo44e9gxBm5XtgMZCVXlA=",
    price: 5.99,
    _id: "product1",
  },
  {
    name: "Milk Bottle",
    description: "Fresh and pure milk for a healthy lifestyle.",
    images:
      "https://unblast.com/wp-content/uploads/2021/07/Two-Milk-Bottles-Mockup-1024x922.jpg",
    price: 2.49,
    _id: "product2",
  },
  {
    name: "Fruit Basket",
    description: "A basket of fresh, seasonal fruits for you.",
    images:
      "https://thumbs.dreamstime.com/b/fruit-basket-sunlit-garden-containing-peaches-plums-cherries-vibrant-colors-slightly-blurred-background-greenery-333818789.jpg",
    price: 12.99,
    _id: "product3",
  },
  {
    name: "Cupcake",
    description: "Delicious cupcake to satisfy your sweet cravings.",
    images:
      "https://www.justsotasty.com/wp-content/uploads/2020/03/Chocolate-Cupcakes-13.jpg",
    price: 3.49,
    _id: "product4",
  },
];

const Product = ({ product, products }) => {
  const productList = products || (!product ? defaultProducts : []);

  if (productList.length > 0) {
    return (
      <div
        className="min-h-screen bg-cover bg-center text-white relative"
        style={{ backgroundImage: `url(${bgProduct})` }}
      >
        <Navbar />

        {/* Top Heading */}
        {/* Top Heading */}
        <div className="pt-24 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-orange-400 tracking-wide">
            Featured Products
          </h1>
          <div className="mt-2 w-24 h-1 bg-orange-500 mx-auto rounded" />
        </div>

        {/* Grid Content */}
        <div className="flex items-center justify-center px-4 pb-12 -mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            {productList.map((prod) => (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`}
                className="bg-[#1f1f1f] border-2 border-black rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform"
              >
                <img
                  src={prod.images}
                  alt={prod.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-orange-400">
                    {prod.name}
                  </h3>
                  <div className="flex justify-center items-center mt-2">
                    <ReactStars
                      edit={false}
                      color="rgba(255,255,255,0.2)"
                      activeColor="tomato"
                      size={20}
                      value={prod.rating || 4}
                      isHalf={true}
                    />
                    <span className="ml-2 text-sm text-gray-300">(256 Reviews)</span>
                  </div>
                  <p className="mt-1 text-xl font-bold text-indigo-400">${prod.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // Single Product View (styled simpler)
  if (product) {
    return (
      <div
        className="min-h-screen bg-cover bg-center text-white relative"
        style={{ backgroundImage: `url(${bgProduct})` }}
      >
        <Navbar />
        <div className="flex justify-center items-center min-h-screen p-8">
          <Link
            className="bg-[#1f1f1f] border-2 border-orange-500 rounded-xl p-4 shadow-lg w-full max-w-sm text-center"
            to={`/product/${product._id || ""}`}
          >
            <img
              src={product.images || "https://via.placeholder.com/150"}
              alt={product.name || "Product Image"}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold text-orange-400 mt-2">
              {product.name || "Unnamed Product"}
            </h3>
            <div className="flex justify-center items-center mt-2">
              <ReactStars
                edit={false}
                color="rgba(255,255,255,0.2)"
                activeColor="tomato"
                size={25}
                value={product.rating || 4}
                isHalf={true}
              />
              <span className="ml-2 text-sm text-gray-300">(256 Reviews)</span>
            </div>
            <p className="text-xl font-bold text-indigo-400 mt-2">
              ${product.price || "0.00"}
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center"
      style={{ backgroundImage: `url(${bgProduct})` }}
    >
      <Navbar />
      <div className="text-center text-xl text-gray-200">
        No product data available
      </div>
    </div>
  );
};

export default Product;
