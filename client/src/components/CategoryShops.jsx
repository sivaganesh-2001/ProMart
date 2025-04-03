import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import axios from "axios";

const CategoryShops = () => {
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Fetch category ID from backend
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/categories");
        const categories = response.data;
        console.log(categories);
        const matchedCategory = categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
        } else {
          console.log("No matching category found.");
          setCategoryId(null);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoryId();
  }, [categoryName]);

  // Load coordinates from localStorage
  const loadCoordinatesFromStorage = () => {
    const storedCoordinates = localStorage.getItem("userCoordinates");
    if (storedCoordinates) {
      const { latitude, longitude } = JSON.parse(storedCoordinates);
      setUserLocation({ latitude, longitude });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation", error);
          setLoading(false);
        }
      );
    } else {
      console.log("Geolocation is not supported.");
      setLoading(false);
    }
  };

  // Initial load and setup event listener for coordinate updates
  useEffect(() => {
    loadCoordinatesFromStorage();

    const handleCoordinatesUpdate = () => {
      loadCoordinatesFromStorage();
    };

    const handleStorageChange = (event) => {
      if (event.key === "userCoordinates") {
        const newCoordinates = JSON.parse(event.newValue);
        setUserLocation({
          latitude: newCoordinates.latitude,
          longitude: newCoordinates.longitude,
        });
      }
    };

    window.addEventListener("userCoordinatesUpdated", handleCoordinatesUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("userCoordinatesUpdated", handleCoordinatesUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch nearby shops when userLocation changes
  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation]);

  const fetchNearbyShops = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/sellers/nearby?latitude=${latitude}&longitude=${longitude}`
      );

      const shopsWithDistance = response.data
        .map((shop) => ({
          ...shop,
          distance: calculateDistance(latitude, longitude, shop.location.y, shop.location.x),
          rating: shop.rating || 4.5,
        }))
        .filter((shop) => shop.distance <= 30); // Filter shops within 30 km

      setShops(shopsWithDistance);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shops:", error);
      setLoading(false);
      setShops([]);
    }
  };

  // Haversine Formula for Distance Calculation (returns distance in km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleShopSelect = (shop) => {
    let storedData = JSON.parse(localStorage.getItem("cart")) || {};

    if (!storedData[shop.id]) {
      storedData[shop.id] = { shopId: shop.id, products: [] };
    }

    if (storedData[shop.id].products.length === 0) {
      delete storedData[shop.id];
    }

    localStorage.setItem("cart", JSON.stringify(storedData));
    navigate(`/shop/${shop.id}`);
  };

  // Filter shops by category and search query
  const filteredShops = categoryId
    ? shops
        .filter((shop) => shop.categories.includes(categoryId))
        .filter((shop) =>
          shop.shopName.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  // Apply Sorting
  const sortedShops = [...filteredShops].sort((a, b) => {
    if (sortType === "distance") return a.distance - b.distance;
    if (sortType === "rating") return b.rating - a.rating;
    if (sortType === "name") return a.shopName.localeCompare(b.shopName);
    return 0;
  });

  if (loading) return <div>Loading nearby shops...</div>;

  return (
    <div className="shop-grid-container py-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Shops for {categoryName}
      </h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <div className="flex items-center border p-2 rounded-md w-2/3 md:w-1/2 lg:w-1/3">
          <input
            type="text"
            placeholder="Search for a shop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 rounded-l-md"
          />
          <button className="bg-[#019875] text-white p-2 rounded-r-md flex items-center justify-center space-x-2 hover:bg-[#017a5b] transition duration-200">
            <BsSearch className="text-xl" />
            <span className="text-lg">Search</span>
          </button>
        </div>
      </div>

      {/* Sorting */}
      <div className="mb-4">
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
          <option value="name">Sort Alphabetically</option>
        </select>
      </div>

      {/* Shop Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedShops.length > 0 ? (
          sortedShops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => handleShopSelect(shop)}
              className="shop-card-large border p-4 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer mx-2"
            >
              <img
                src={shop.shopImageUrl}
                alt={shop.shopName}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="mt-2 font-semibold">{shop.shopName}</h3>
              <p className="text-gray-600">Rating: ⭐ {shop.rating.toFixed(1)}</p>
              <p className="text-gray-600">Distance: {shop.distance.toFixed(2)} km</p>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No shops found within 30 km for this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryShops;