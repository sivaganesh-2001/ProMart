import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function ProductDetails({ data }) {
  // Function to handle adding product to cart
  const handleAddToCart = (product) => {
    console.log("Added to Cart:", product);
  };

  return (
    <div className="flex flex-row flex-wrap pb-20 w-auto">
      {data?.map((el, id) => (
        <div key={id} className="border-[1px] border-[#b9b9b971] relative">
          <Link to={`${id}`}>
            <ProductCard data={el} />
          </Link>

          {/* Add to Cart Button */}
          <button
            onClick={() => handleAddToCart(el)}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default ProductDetails;


