import React, { useState, useEffect } from "react";
import { BsBag, BsSearch } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import ProductSearchBar from "./ProductSearchBar";
import LocationPicker from "../components/seller/LocationPickerNavbar";

const GOOGLE_MAPS_API_KEY = "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw";

const Navbar = () => {
  const [currentArea, setCurrentArea] = useState("Fetching...");
  const [locationFetched, setLocationFetched] = useState(false);
  const [isLocationOptionsOpen, setIsLocationOptionsOpen] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  const userData = useSelector((store) => store.userAuthReducer.user);
  const cartItems = useSelector((store) => store.cartReducer.cart);
  const customerEmail = localStorage.getItem("customerEmail");

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
              const areaComponent = results[0].address_components.find((component) =>
                component.types.includes("sublocality") || component.types.includes("locality")
              );
              const detectedArea = areaComponent?.long_name || "Unknown Area";
              setCurrentArea(detectedArea);
              localStorage.setItem("userLocation", detectedArea);
              localStorage.setItem("userCoordinates", JSON.stringify({ latitude, longitude }));
              window.dispatchEvent(new Event("userCoordinatesUpdated")); // Dispatch custom event
            } else {
              setCurrentArea("Location Not Found");
            }
          } catch (error) {
            console.error("Error fetching area:", error.message);
            setCurrentArea("Error Fetching Location");
          } finally {
            setLocationFetched(true);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setCurrentArea("Permission Denied");
          setLocationFetched(true);
        }
      );
    } else {
      setCurrentArea("Geolocation Not Supported");
      setLocationFetched(true);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (customerEmail) {
      const fetchCartCount = async () => {
        if (!customerEmail) return;
        try {
          const response = await axios.get("http://localhost:8081/api/cart/count", {
            params: { userId: customerEmail },
          });
          setCartCount(response.data);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      };
      fetchCartCount();
    }
  }, [customerEmail]);

  useEffect(() => {
    setCartCount(cartItems.length);
  }, [cartItems]);

  const extractAreaName = async (latitude, longitude) => {
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
        const areaComponent = results[0].address_components.find((component) =>
          component.types.includes("sublocality") || component.types.includes("locality")
        );
        return areaComponent?.long_name || "Unknown Area";
      }
      return "Location Not Found";
    } catch (error) {
      console.error("Error extracting area name:", error.message);
      return "Error Fetching Location";
    }
  };

  const handleLocationSelect = async (data) => {
    const { latitude, longitude } = data;
    const areaName = await extractAreaName(latitude, longitude);
    setCurrentArea(areaName);
    localStorage.setItem("userLocation", areaName);
    localStorage.setItem("userCoordinates", JSON.stringify({ latitude, longitude }));
    window.dispatchEvent(new Event("userCoordinatesUpdated")); // Dispatch custom event
    setLocationFetched(true);
    setShowLocationPicker(false);
  };

  const getRedirectPath = () => {
    if (localStorage.getItem("customerEmail")) return "/";
    if (localStorage.getItem("adminEmail")) return "/admin-dashboard";
    if (localStorage.getItem("sellerEmail")) return "/dashboard";
    return "/";
  };

  return (
    <>
      <div className="bg-[#019875] flex flex-row h-[80px] w-[100%] items-center justify-around md:justify-evenly">
        <div className="flex flex-row items-center justify-evenly">
          <Link to={getRedirectPath()}>
            <h2 className="text-white font-semibold text-[13px] md:text-[16px] lg:text-[20px] ml-4">
              ProMart
            </h2>
          </Link>
          <div className="h-[30px] w-[3px] bg-[#c6c6c6b8] rounded-xl ml-4"></div>
          <h2
            className="text-white font-semibold text-[13px] md:text-[16px] lg:text-[20px] ml-4 cursor-pointer"
            onClick={() => setIsLocationOptionsOpen(!isLocationOptionsOpen)}
          >
            {currentArea}
          </h2>
        </div>
        <ProductSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locationFetched={locationFetched}
        />
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
            className={`hidden sm:flex bg-[#FF3269] text-white text-[13px] md:text-[16px] font-semibold px-4 md:px-9 rounded-lg lg:flex mr-10 h-[60px] items-center justify-center ${
              !locationFetched ? "bg-gray-300 cursor-not-allowed" : ""
            }`}
            disabled={!locationFetched}
          >
            <BsBag className="text-[24px] mr-3" />
            {userData ? `My Cart ` : "My Cart"}
          </button>
        </Link>
      </div>

      {isLocationOptionsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%]">
            <h2 className="text-lg font-bold mb-4">Location Options</h2>
            <div className="flex flex-col gap-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => {
                  fetchLocation();
                  setIsLocationOptionsOpen(false);
                }}
              >
                Use Current Location
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  setShowLocationPicker(true);
                  setIsLocationOptionsOpen(false);
                }}
              >
                Select Location
              </button>
            </div>
          </div>
        </div>
      )}

      {showLocationPicker && (
        <LocationPicker
          setShowMap={setShowLocationPicker}
          setFormData={handleLocationSelect}
        />
      )}
    </>
  );
};

export default Navbar;