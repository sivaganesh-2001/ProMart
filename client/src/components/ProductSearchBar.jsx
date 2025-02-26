import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

const ProductSearchBar = ({ searchQuery, setSearchQuery, locationFetched }) => {
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fetch product suggestions from the backend
  const fetchProducts = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/api/products/search?query=${query}`
      );

      // Filter out duplicate product names (case-insensitive & space-insensitive)
      const uniqueProducts = [];
      const seen = new Set();

      response.data.forEach((product) => {
        const normalizedName = product.productName.toLowerCase().replace(/\s+/g, "");
        if (!seen.has(normalizedName)) {
          seen.add(normalizedName);
          uniqueProducts.push(product);
        }
      });

      setSuggestions(uniqueProducts);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 300), []);

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedFetchProducts(value);
  };

  // Handle product selection
  const selectProduct = (product) => {
    setSearchQuery(product.productName);
    setSuggestions([]);
    
    // Navigate to SearchedProductsPage with the selected product name
    navigate(`/search-results?product=${encodeURIComponent(product.productName)}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        className={`hidden md:flex md:w-[400px] lg:w-[800px] h-[42px] rounded-lg px-8 ${
          !locationFetched ? "bg-gray-300 cursor-not-allowed" : ""
        }`}
        placeholder="Search for over 5000+ products"
        disabled={!locationFetched}
        value={searchQuery}
        onChange={handleInputChange}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1">
          {suggestions.map((product) => (
            <li
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectProduct(product)}
            >
              {product.productName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductSearchBar;
