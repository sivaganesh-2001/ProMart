import React, { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ShopCard from "../ShopCard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ExploreShops.css";

const ExploreShops = () => {
  const [shops, setShops] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      console.log("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoordinatesFromStorage();

    // Listen for custom event from Navbar
    const handleCoordinatesUpdate = () => {
      loadCoordinatesFromStorage();
    };

    // Also listen for storage events (cross-tab)
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

  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation.latitude, userLocation.longitude);
      console.log("Fetching shops for latitude:", userLocation.latitude);
    }
  }, [userLocation]);

  const fetchNearbyShops = async (latitude, longitude) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8081/api/sellers/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      const shopsWithDistance = response.data.map((shop) => ({
        ...shop,
        distance: calculateDistance(latitude, longitude, shop.location.y, shop.location.x),
      }));
      setShops(shopsWithDistance);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching nearby shops:", error);
      setLoading(false);
      setShops([]);
    }
  };

  const handleShopSelect = (shop) => {
    console.log("Selected Shop:", shop);
    let storedData = JSON.parse(localStorage.getItem("cart")) || {};

    if (!storedData[shop.id]) {
      storedData[shop.id] = { shopId: shop.id, products: [] };
    }

    if (storedData[shop.id].products.length === 0) {
      delete storedData[shop.id];
    }

    localStorage.setItem("cart", JSON.stringify(storedData));
    console.log("Updated Local Storage:", storedData);
    navigate(`/shop/${shop.id}`);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    } else {
      return `${distanceKm.toFixed(2)} km`;
    }
  };

  const sliderLeft = () => {
    const slider = document.getElementById("shop-slider");
    slider.scrollLeft -= 500;
  };

  const sliderRight = () => {
    const slider = document.getElementById("shop-slider");
    slider.scrollLeft += 500;
  };

  const isCentered = shops.length < 5;

  if (loading) return <div>Loading nearby shops...</div>;

  return (
    <div className="mt-2 py-10">
      <div className="flex flex-row justify-around gap-[200px] ml-0 md:gap-[700px] pb-6 sm:ml-0">
        <h2 className="text-md sm:text-xl font-semibold py-2">Explore Nearby Shops</h2>
        <Link
          to="/all-shops"
          className="flex flex-row justify-center items-center gap-2 font-semibold text-[#FF3269]"
        >
          See All
        </Link>
      </div>

      <div className="w-full flex flex-row items-center">
        <MdChevronLeft
          onClick={sliderLeft}
          className="text-[40px] text-black ml-4 cursor-pointer opacity-50 hover:opacity-100"
        />
        <div
          className={`ml-1 w-[85%] flex gap-6 overflow-x-scroll scroll-smooth ${
            isCentered ? "justify-center" : "justify-start"
          }`}
          id="shop-slider"
        >
          {shops.map((shop) => (
            <div
              key={shop.id}
              onClick={() => {
                handleShopSelect(shop);
                console.log("Selected Shop Details:", shop.id);
                navigate(`/shop/${shop.id}`);
              }}
            >
              <ShopCard shop={shop} distance={shop.distance} isShopInRange={shop.distance <= 30} />
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={sliderRight}
          className="text-[40px] text-black cursor-pointer opacity-50 hover:opacity-100"
        />
      </div>
    </div>
  );
};

export default ExploreShops;