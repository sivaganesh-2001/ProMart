import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStore } from "react-icons/fa"; // Import shop icon

const RecommendedProductsPage = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState(null);
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopNames, setShopNames] = useState({}); // Store shop names by sellerId
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user coordinates from localStorage or geolocation
  const loadCoordinatesFromStorage = () => {
    const storedCoordinates = localStorage.getItem("userCoordinates");
    if (storedCoordinates) {
      const { latitude, longitude } = JSON.parse(storedCoordinates);
      setUserLocation({ latitude, longitude });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setUserLocation(location);
          localStorage.setItem("userCoordinates", JSON.stringify(location));
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setError("Unable to fetch your location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  // Haversine Formula for Distance Calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Fetch nearby shops within 30 km and extract shop names
  const fetchNearbyShops = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/sellers/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      const shopsWithDistance = response.data.map((shop) => ({
        ...shop,
        distance: calculateDistance(latitude, longitude, shop.location.y, shop.location.x),
      }));
      const nearbyShops = shopsWithDistance.filter((shop) => shop.distance <= 30);
      setShops(nearbyShops);

      // Create shop name mapping from fetched shops
      const shopNameMap = {};
      nearbyShops.forEach((shop) => {
        shopNameMap[shop.id] = shop.shopName;
      });
      setShopNames(shopNameMap);
    } catch (error) {
      console.error("Error fetching nearby shops:", error);
      setError("Failed to fetch nearby shops.");
    }
  };

  // Fetch recommendations and products
  const fetchRecommendationsAndProducts = async () => {
    try {
      const customerEmail = localStorage.getItem("customerEmail");
      if (!customerEmail) {
        throw new Error("Customer email not found in local storage. Please log in.");
      }

      // Fetch recommendations
      const recommendationResponse = await axios.get("http://localhost:8081/api/recommendations", {
        params: { email: customerEmail },
      });

      console.log("Recommended Products Data:", recommendationResponse.data);

      // Extract all productIds from the response
      const productIds = recommendationResponse.data.flatMap((item) => item.productIds || []);
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
      setProducts(productsResponse.data);
    } catch (error) {
      console.error("Error fetching recommendations or products:", error);
      setError(error.message || "Failed to fetch recommendations or products.");
    } finally {
      setLoading(false);
    }
  };

  // Initial setup
  useEffect(() => {
    loadCoordinatesFromStorage();
  }, []);

  // Fetch shops and products when location is available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation.latitude, userLocation.longitude);
      fetchRecommendationsAndProducts();
    }
  }, [userLocation]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg">Fetching recommended products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 text-lg">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-600 text-center mb-4">
        Recommended Products from Nearby Shops (Within 30 km)
      </h2>

      <div className="mb-4 text-center">
        <input
          type="text"
          placeholder="Search Recommended Products..."
          className="border px-4 py-2 rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-green-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">
          No recommended products match your search within 30 km.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const shop = shops.find((s) => s.id === product.sellerId) || { id: "default" };
            return (
              <div
                key={product.id}
                className="border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/shop/${shop.id}/product/${product.id}`)}
              >
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.productName}
                  className="h-40 w-full object-cover rounded-lg"
                />
                <div className="p-2">
                  <h3 className="font-semibold text-lg truncate">{product.productName}</h3>
                  <p className="text-gray-600 text-sm">Brand: {product.brand || "N/A"}</p>
                  <p className="flex items-center mt-2 text-blue-600 font-semibold text-md">
                    <FaStore className="mr-2 text-lg" />
                    {shopNames[product.sellerId] || "Unknown Shop"}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-lg font-bold text-green-600">₹{product.price}</p>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">
                      View
                    </button>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Distance: {shop.distance ? `${shop.distance.toFixed(2)} km` : "Unknown"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedProductsPage;