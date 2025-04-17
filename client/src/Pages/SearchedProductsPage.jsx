import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaStore } from "react-icons/fa"; // Import shop icon

const SearchedProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [shopNames, setShopNames] = useState({}); // Store shop names by sellerId
  const [shops, setShops] = useState([]); // Store nearby shops with distances
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the selected product name from query params
  const queryParams = new URLSearchParams(location.search);
  const productName = queryParams.get("product");

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

  // Fetch and filter products from nearby shops
  const fetchMatchingProducts = async () => {
    if (!productName || !userLocation) return;

    try {
      // Fetch all matching products
      const response = await axios.get(
        `http://localhost:8081/api/products/match?productName=${encodeURIComponent(productName)}`
      );
      const allProducts = response.data;

      // Filter products based on shops within 30 km
      const nearbyShopIds = new Set(shops.map((shop) => shop.id));
      const filteredProducts = allProducts.filter((product) => nearbyShopIds.has(product.sellerId));
      setProducts(filteredProducts);

      // If no additional shop fetching is needed, shopNames is already set from fetchNearbyShops
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Initial setup: Load coordinates
  useEffect(() => {
    loadCoordinatesFromStorage();
  }, []);

  // Fetch shops and products when location and productName are available
  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  useEffect(() => {
    if (shops.length > 0 && userLocation) {
      fetchMatchingProducts();
    }
  }, [shops, productName]);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-semibold">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
        Search Results for "{productName}" (Within 30 km)
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products found within 30 km</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const shop = shops.find((s) => s.id === product.sellerId) || { id: "default" };
            return (
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

export default SearchedProductsPage;