import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddToCartButton from "../components/AddToCartButton";

const ProductDetailsPage = () => {
  const { shopId, productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/products/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, shopId]);

  if (loading) return <div className="text-center text-lg">Loading product details...</div>;
  if (!product) return <div className="text-center text-lg text-red-500">No Product found</div>;

  // Determine stock status
  let stockStatus, stockColor;
  if (product.stock === 0) {
    stockStatus = "Out of Stock";
    stockColor = "bg-red-500";
  } else if (product.stock > 0 && product.stock <= 20) {
    stockStatus = "Low Stock";
    stockColor = "bg-orange-500";
  } else {
    stockStatus = "In Stock";
    stockColor = "bg-green-500";
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white relative">
      {/* Stock Badge */}
      <div className={`absolute top-4 right-4 text-white px-4 py-1 rounded-md text-sm font-semibold ${stockColor}`}>
        {stockStatus}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.productName}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Quantity:</span> {product.netQuantity} {product.unit}
          </p>

          {/* Price Section */}
          <p className="text-2xl font-bold text-gray-900 mt-4">
            <span className="font-semibold">Price:</span> ₹{product.price}
          </p>

          <div className="flex items-center gap-4">
            {/* Add to Cart Button with stock check */}
            <AddToCartButton 
              product={product} 
              shopId={shopId} 
              stockStatus={stockStatus}
            />

            {/* Go to Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold transition"
            >
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
