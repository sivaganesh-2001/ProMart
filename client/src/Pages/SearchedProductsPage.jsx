import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaStore } from "react-icons/fa"; // Import shop icon

const SearchedProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [shopNames, setShopNames] = useState({}); // Store shop names by sellerId
  const [loading, setLoading] = useState(true);

  // Get the selected product name from query params
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("product");

  useEffect(() => {
    const fetchMatchingProducts = async () => {
      if (!productName) return;

      try {
        const response = await axios.get(
          `http://localhost:8081/api/products/match?productName=${encodeURIComponent(productName)}`
        );
        setProducts(response.data);

        // Extract unique sellerIds
        const uniqueSellerIds = [...new Set(response.data.map((p) => p.sellerId))];

        // Fetch shop names for each sellerId
        const shopResponses = await Promise.all(
          uniqueSellerIds.map((sellerId) =>
            axios.get(`http://localhost:8081/api/sellers/id/${sellerId}`)
          )
        );

        // Create a map of sellerId -> shopName
        const shopData = {};
        shopResponses.forEach((res, index) => {
          shopData[uniqueSellerIds[index]] = res.data.shopName;
        });

        setShopNames(shopData);
      } catch (error) {
        console.error("Error fetching products or shop names:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingProducts();
  }, [productName]);

  if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading products...</div>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
        Search Results for "{productName}"
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer bg-white"
              onClick={() => navigate(`/shop/${product.sellerId}/product/${product.id}`)}
            >
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{product.productName}</h3>
                <p className="text-gray-600 text-sm">Brand: {product.brand}</p>
                
                {/* Improved Shop Name Visibility */}
                <p className="flex items-center mt-2 text-blue-600 font-semibold text-md">
                  <FaStore className="mr-2 text-lg" /> {/* Shop Icon */}
                  {shopNames[product.sellerId] || "Loading..."}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                  <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchedProductsPage;
