import React, { useState, useEffect } from "react";
import { FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import SearchBar from "./LocationSearchBar";

const YOUR_GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with actual key

const LocationPicker = ({ setShowMap, setDeliveryCoordinates, setDeliveryCharge, shopLocation }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [initialLocation, setInitialLocation] = useState(null); // To store the initial location

  const initializeMap = () => {
    const google = window.google;
    if (!google || !google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    const defaultLocation = { lat: 12.9716, lng: 77.5946 }; // Default: Bangalore
    const mapInstance = new google.maps.Map(document.getElementById("map"), {
      center: defaultLocation,
      zoom: 14,
      disableDefaultUI: true,
    });

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = { lat: latitude, lng: longitude };
          setInitialLocation(userLocation); // Store the current location
          mapInstance.setCenter(userLocation);
          placeMarker(userLocation, mapInstance); // Pin the current location
        },
        () => {
          placeMarker(defaultLocation, mapInstance);
        }
      );
    } else {
      placeMarker(defaultLocation, mapInstance);
    }

    // Click event to place marker
    mapInstance.addListener("click", (event) => {
      placeMarker(event.latLng.toJSON(), mapInstance);
    });

    setMap(mapInstance);
  };

  // Remove previous marker and place a new one
  const placeMarker = (location, mapInstance) => {
    if (marker) marker.setMap(null); // Remove previous marker

    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
    });

    setMarker(newMarker);
    mapInstance.setCenter(location);

    // Get address
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${YOUR_GOOGLE_MAPS_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const address =
          data.results[0]?.formatted_address || `${location.lat}, ${location.lng}`;
        setDeliveryCoordinates({
          address,
          latitude: location.lat,
          longitude: location.lng,
        });
      })
      .catch((error) => console.error("Error fetching address:", error));
  };

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API not loaded");
      return;
    }
    initializeMap();
  }, []);

  useEffect(() => {
    // If there's an initial location, place a marker for it
    if (initialLocation) {
      placeMarker(initialLocation, map);
    }
  }, [initialLocation, map]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleConfirmLocation = () => {
    if (marker) {
      const position = marker.getPosition();
      const latLng = {
        lat: position.lat(),
        lng: position.lng(),
      };
      placeMarker(latLng, map); // Update marker position
      setShowMap(false); // Close the map
    }
  };

  // Calculate distance and update delivery charge
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    // Update delivery charge based on distance
    if (distance <= 5) {
      setDeliveryCharge(40);
    } else {
      setDeliveryCharge(distance * 10);
    }
  };

  useEffect(() => {
    if (marker) {
      const position = marker.getPosition();
      const latLng = {
        lat: position.lat(),
        lng: position.lng(),
      };
      calculateDistance(latLng.lat, latLng.lng, shopLocation.x, shopLocation.y);
    }
  }, [marker, shopLocation]);

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 ${
        isFullscreen ? "bg-white" : "bg-black bg-opacity-50"
      }`}
    >
      {!isFullscreen && <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>}

      <div
        className={`bg-white p-6 rounded-lg shadow-lg flex flex-col relative z-10 ${
          isFullscreen ? "w-full h-full rounded-none" : "w-full max-w-3xl h-3/4"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Location</h2>
          <div className="flex gap-4">
            {/* Fullscreen Toggle */}
            <button onClick={toggleFullscreen} className="text-gray-500 hover:text-gray-700">
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            {/* Close Button */}
            <button onClick={() => setShowMap(false)} className="text-red-500 hover:text-red-700">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Search Bar (Always visible) */}
        <SearchBar
          setSearchTerm={setSearchTerm}
          setMarker={(latLng) => placeMarker(latLng, map)}
          map={map}
        />

        {/* Map Container */}
        <div
          id="map"
          className="w-full flex-1 rounded-lg mb-4"
          style={{ minHeight: isFullscreen ? "100%" : "70%" }}
        />

        {/* Confirm Location Button */}
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleConfirmLocation}
            className="bg-green-500 text-white p-2 rounded-md"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;