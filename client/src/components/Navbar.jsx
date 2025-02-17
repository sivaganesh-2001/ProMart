import React, { useState, useEffect } from "react";
import { BsBag, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";



const GOOGLE_MAPS_API_KEY = "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw"; 


const Navbar = () => {
  const [currentCity, setCurrentCity] = useState("Fetching...");
  const [locationFetched, setLocationFetched] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [cartCount, setCartCount] = useState(0); 

  const userData = useSelector((store) => store.userAuthReducer.user); // Get user data from redux store
  const cartItems = useSelector((store) => store.cartReducer.cart); // Get cart data from redux store

  const customerEmail = localStorage.getItem("customerEmail"); // Get sellerEmail from localStorage

  // Fetch current location (auto-detected)
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
                  key: GOOGLE_MAPS_API_KEY,// Replace with a secured key in production
                },
              }
            );

            const results = response.data.results;
            if (results.length > 0) {
              const cityComponent = results[0].address_components.find((component) =>
                component.types.includes("locality")
              );
              
              const detectedCity = cityComponent?.long_name || "Unknown City";
              setCurrentCity(cityComponent?.long_name || "Unknown City");
              setCurrentCity(detectedCity);
              localStorage.setItem("userLocation", detectedCity);
            } else {
              setCurrentCity("Location Not Found");
            }
          } catch (error) {
            console.error("Error fetching city:", error.message);
            setCurrentCity("Error Fetching Location");
          } finally {
            setLocationFetched(true);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setCurrentCity("Permission Denied");
          setLocationFetched(true);
        }
      );
    } else {
      setCurrentCity("Geolocation Not Supported");
      setLocationFetched(true);
    }
  };

  // Fetch current location when the component mounts
  useEffect(() => {
    fetchLocation();
  }, []);

  // Fetch cart count from backend when user is logged in
  useEffect(() => {
    if (customerEmail) {
      const fetchCartCount = async () => {
        if (!customerEmail) return;
    
        try {
          const response = await axios.get("http://localhost:8081/api/cart/count", {
            params: { userId: customerEmail },
          });
          setCartCount(response.data); // Update state with cart count from backend
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      };

      fetchCartCount();
    }
  }, [customerEmail]);

  // Watch for cartItems in Redux and update cart count dynamically
  useEffect(() => {
    setCartCount(cartItems.length); // Assuming `cartItems` is an array of products
  }, [cartItems]);

  // Fetch location suggestions from Google Places API
const fetchLocationSuggestions = async (query) => {
  if (!query) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: query,
          key: GOOGLE_MAPS_API_KEY,
          components: "country:in", // Restrict to India (change as needed)
          types: "(cities)", // Limit results to city names
        },
      }
    );

    setSuggestions(response.data.predictions || []);
  } catch (error) {
    console.error("Error fetching location suggestions:", error.response?.data || error.message);
  }
};


  // Handle selecting a location from the search results
  const handleLocationSelect = async (placeId) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json`,
        {
          params: {
            place_id: placeId,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const locationName = response.data.result.formatted_address;
      setCurrentCity(locationName);
      localStorage.setItem("userLocation", locationName);
      setIsLocationModalOpen(false);
    } catch (error) {
      console.error("Error fetching location details:", error);
    }

  };

  const getRedirectPath = () => {
    if (localStorage.getItem("customerEmail")) {
      return "/";
    } else if (localStorage.getItem("adminEmail")) {
      return "/admin-dashboard";
    } else if (localStorage.getItem("sellerEmail")) {
      return "/dashboard";
    } else {
      return "/"; // Default path if no email key exists
    }
  };

  return (
    <>
      <div className="bg-[#019875] flex flex-row h-[80px] w-[100%] items-center justify-around md:justify-evenly">
        {/* Left Section */}
        <div className="flex flex-row items-center justify-evenly">
          <Link to={getRedirectPath()}>
            <h2 className="text-white font-semibold text-[13px] md:text-[16px] lg:text-[20px] ml-4">
              ProMart
            </h2>
          </Link>
          <div className="h-[30px] w-[3px] bg-[#c6c6c6b8] rounded-xl ml-4"></div>
          <h2
            className="text-white font-semibold text-[13px] md:text-[16px] lg:text-[20px] ml-4 cursor-pointer"
            onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
          >
            {currentCity}
          </h2>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            className={`hidden md:flex md:w-[400px] lg:w-[800px] h-[42px] rounded-lg px-8 ${
              !locationFetched ? "bg-gray-300 cursor-not-allowed" : ""
            }`}
            placeholder="Search for over 5000+ products"
            disabled={!locationFetched}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <BsSearch className="hidden sm:flex md:hidden text-white text-[20px]" />

        {/* User Actions */}
        {!userData ? (
          <Link to="/login" className="text-white font-semibold hidden sm:flex">
            Login
          </Link>
        ) : (
          <Link to="/account" className="text-white font-semibold hidden sm:flex">
            My Account
          </Link>
        )}

        <Link to="/cart">
          <button
            className={`hidden sm:flex bg-[#FF3269] text-white text-[13px] md:text-[16px] font-semibold px-4 md:px-9  rounded-lg lg:flex mr-10 h-[60px] items-center justify-center ${
              !locationFetched ? "bg-gray-300 cursor-not-allowed" : ""
            }`}
            disabled={!locationFetched}
          >
            <BsBag className="text-[24px] mr-3" />
            {/* {userData ? `My Cart (${cartCount})` : "My Cart"} Show cart count if logged in */}
            {userData ? `My Cart ` : "My Cart"} {/* Show cart count if logged in */}
          </button>
        </Link>
      </div>

      {/* Location Modal */}
   {/* Location Modal */}
   {isLocationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%]">
            <h2 className="text-lg font-bold mb-4">Select Your Location</h2>
            <div className="flex flex-col gap-4">
              {/* Use Current Location */}
              <button className="bg-[#019875] text-white py-2 px-4 rounded-lg" onClick={fetchLocation}>
                Use Current Location
              </button>

              {/* Search Bar for Manual Location */}
              <input
                type="text"
                placeholder="Search for another location"
                className="border border-gray-300 rounded-lg px-4 py-2"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  fetchLocationSuggestions(e.target.value);
                }}
              />

              {/* Search Suggestions */}
              {suggestions.length > 0 && (
                <ul className="bg-white border border-gray-300 rounded-lg shadow-md">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleLocationSelect(suggestion.place_id)}
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
