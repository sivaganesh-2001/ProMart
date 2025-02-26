import { useEffect, useState } from "react";
import axios from "axios";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // Import icons

export default function Topbar({ pageTitle }) {
  const [shopName, setShopName] = useState("");
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentCity, setCurrentCity] = useState("Fetching...");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const sellerEmail = localStorage.getItem("sellerEmail");
  const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (sellerEmail) {
        try {
          const response = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
          setShopName(response.data.shopName || "Your Shop");
          setShopImageUrl(response.data.shopImageUrl || "/default-shop.png");
        } catch (error) {
          console.error("Error fetching shop details:", error);
        }
      }
    };

    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json`,
                {
                  params: {
                    latlng: `${latitude},${longitude}`,
                    key: GOOGLE_MAPS_API_KEY,
                  },
                }
              );
              const results = response.data.results;
              if (results.length > 0) {
                const cityComponent = results[0].address_components.find((component) =>
                  component.types.includes("locality")
                );
                const detectedCity = cityComponent?.long_name || "Unknown City";
                setCurrentCity(detectedCity);
                localStorage.setItem("userLocation", detectedCity);
              } else {
                setCurrentCity("Location Not Found");
              }
            } catch (error) {
              console.error("Error fetching city:", error.message);
              setCurrentCity("Error Fetching Location");
            }
          },
          (error) => {
            console.error("Error fetching location:", error.message);
            setCurrentCity("Permission Denied");
          }
        );
      } else {
        setCurrentCity("Geolocation Not Supported");
      }
    };

    fetchShopDetails();
    fetchLocation();
  }, [sellerEmail]);

  const handleSignOut = () => {
    localStorage.removeItem("sellerEmail");
    window.location.href = "/login"; // Redirect to login page
  };


  return (
    <header className="bg-[#019875] h-[80px] flex items-center justify-between px-8 shadow-lg relative">
      {/* Left Section: ProMart Title */}
      <div className="flex items-center space-x-6">
        <h1 className="text-white font-semibold cursor-pointer mt-3 ml-2">ProMart</h1>
      </div>

      {/* Center Section: Shop Name */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {shopName && <h1 className="text-white text-2xl font-bold mt-3">{shopName}</h1>}
      </div>

      {/* Right Section: Profile Image and Dropdown */}
      <div className="relative flex items-center">
        {/* Profile Image */}
        {shopImageUrl && (
          <img
            src={shopImageUrl}
            alt="Shop"
            className="w-[55px] h-[55px] rounded-full cursor-pointer border-2 border-white"
            onClick={() => setShowDropdown(!showDropdown)}
          />
        )}

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-40 w-[160px] bg-white shadow-lg rounded-lg py-2">
            {/* Profile Info */}
            <div className="flex items-center px-4 py-2 border-b">
              <FaUserCircle className="text-gray-600 text-xl mr-2" />
              <span className="text-gray-700 font-medium">Profile</span>
            </div>

            {/* Sign Out Button */}
            <button
              className="w-full flex items-center text-red-600 font-semibold py-2 px-4 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="mr-2" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}