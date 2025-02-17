import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
        console.log("Selected Product ID:", productId);
        console.log("Shop ID:", shopId);
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, shopId]); // Include shopId in dependencies

  if (loading) return <div>Loading product details...</div>;
  if (!product) return <div>No Product found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 shadow-lg rounded-lg bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2">
          <img src={product.imageUrl} alt={product.productName} className="w-full rounded-lg" />
        </div>

        <div className="w-full md:w-1/2 px-6">
          <h1 className="text-2xl font-semibold">{product.productName}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-xl font-bold mt-2">₹{product.price}</p>

          <div className="flex items-center gap-4 mt-4">
            {/* Pass shopId explicitly to AddToCartButton */}
            <AddToCartButton product={product} shopId={shopId} />

            {/* Go to Cart Button */}
            <button
              onClick={() => navigate("/cart")}
              className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold"
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
