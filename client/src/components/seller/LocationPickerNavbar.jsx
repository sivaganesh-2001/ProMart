import React, { useState, useEffect } from "react";
import { FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import SearchBar from "./LocationSearchBar";

const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw";

const LocationPicker = ({ setShowMap, setFormData }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [initialLocation, setInitialLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // Store selected location temporarily

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
          setInitialLocation(userLocation);
          mapInstance.setCenter(userLocation);
          placeMarker(userLocation, mapInstance);
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

  // Place a new marker and store the location
  const placeMarker = (location, mapInstance) => {
    if (marker) marker.setMap(null); // Remove previous marker

    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
    });

    setMarker(newMarker);
    mapInstance.setCenter(location);

    // Store the selected location temporarily
    setSelectedLocation({
      latitude: location.lat,
      longitude: location.lng,
    });
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
    if (initialLocation) {
      placeMarker(initialLocation, map);
    }
  }, [initialLocation, map]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      // Only send the confirmed location to Navbar
      setFormData(selectedLocation);
      setShowMap(false); // Close the map
    } else {
      console.warn("No location selected");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center z-50 ${
        isFullscreen ? "bg-white" : "bg-black bg-opacity-50"
      }`}
    >
      {!isFullscreen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
      )}

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

        {/* Search Bar */}
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