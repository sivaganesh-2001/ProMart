import React, { useState, useEffect } from "react";
import { BsChevronRight } from "react-icons/bs";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FaStore } from "react-icons/fa"; // Import shop icon
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CuratedForYou = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [shopNames, setShopNames] = useState({}); // Store shop names by sellerId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slider controls
  const sliderLeft = () => {
    const slider = document.getElementById("slider3");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const sliderRight = () => {
    const slider = document.getElementById("slider3");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  // Fetch shop names based on sellerIds
  const fetchShopNames = async (sellerIds) => {
    try {
      const response = await axios.get("http://localhost:8081/api/sellers", {
        params: { ids: sellerIds },
        paramsSerializer: (params) => `ids=${params.ids.join("&ids=")}`,
      });
      const shopNameMap = {};
      response.data.forEach((shop) => {
        shopNameMap[shop.id] = shop.shopName;
      });
      setShopNames(shopNameMap);
    } catch (error) {
      console.error("Error fetching shop names:", error);
    }
  };

  // Fetch recommendations and products
  const fetchRecommendationsAndProducts = async () => {
    try {
      const customerEmail = localStorage.getItem("customerEmail");
      if (!customerEmail) {
        throw new Error("Customer email not found in local storage.");
      }

      // Fetch recommendations
      const recommendationResponse = await axios.get("http://localhost:8081/api/recommendations", {
        params: { email: customerEmail },
      });

      console.log("Recommended Products Data:", recommendationResponse.data);

      // Extract only the first productId from each item, limit to 10 unique products
      const productIds = recommendationResponse.data
        .map((item) => item.productIds[0]) // Take only the first productId from each array
        .filter(Boolean) // Remove any undefined/null values
        .slice(0, 10); // Limit to 10 products
      console.log("Extracted Product IDs:", productIds);

      if (productIds.length === 0) {
        throw new Error("No product IDs found in recommendations.");
      }

      // Fetch products by productIds
      const productsResponse = await axios.get("http://localhost:8081/api/products/id", {
        params: { ids: productIds },
        paramsSerializer: (params) => `ids=${params.ids.join("&ids=")}`,
      });

      console.log("Fetched Products:", productsResponse.data);
      const fetchedProducts = productsResponse.data.slice(0, 10);
      setProducts(fetchedProducts);

      // Extract sellerIds from products and fetch shop names
      const sellerIds = [...new Set(fetchedProducts.map((product) => product.sellerId))];
      if (sellerIds.length > 0) {
        await fetchShopNames(sellerIds);
      }
    } catch (error) {
      console.error("Error fetching recommendations or products:", error);
      setError(error.message || "Failed to fetch curated products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRecommendationsAndProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg">Loading curated products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-2 py-10">
      <div className="flex flex-row justify-around gap-[200px] ml-0 md:gap-[700px] pb-6 sm:ml-0">
        <h2 className="text-md sm:text-xl font-semibold py-2">Curated For You</h2>
        <a
          href="/recommended-products"
          className="flex flex-row justify-center items-center gap-2 font-semibold text-[#FF3269]"
        >
          See All
          <BsChevronRight />
        </a>
      </div>
      <div className="w-[1850px] flex flex-row">
        <MdChevronLeft
          onClick={sliderLeft}
          className="text-[40px] text-black ml-16 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-24"
        />
        <div
          className="ml-1 w-[1250px] overflow-x-hidden scroll-smooth"
          id="slider3"
        >
          <div className="flex-row cursor-pointer relative flex items-center w-[1550px] h-full whitespace-nowrap">
            {products.slice(0, 10).map((product) => (
              <div
                key={product.id}
                className="border rounded-lg shadow-md hover:shadow-lg transition cursor-pointer w-[300px] mx-2 hover:mx-4"
                onClick={() => navigate(`/shop/${product.sellerId || "default"}/product/${product.id}`)}
              >
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.productName}
                  className="h-[150px] w-full object-cover rounded-t-lg"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-sm truncate">{product.productName}</h3>
                  <p className="flex items-center mt-2 text-blue-600 font-semibold text-sm">
                    <FaStore className="mr-2 text-lg" />
                    {shopNames[product.sellerId] || "Unknown Shop"}
                  </p>
                  <p className="text-green-600 font-bold text-sm mt-1">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <MdChevronRight
          onClick={sliderRight}
          className="text-[40px] text-black ml-2 cursor-pointer opacity-50 hover:opacity-100 mt-6 md:mt-24"
        />
      </div>
    </div>
  );
};

export default CuratedForYou;
