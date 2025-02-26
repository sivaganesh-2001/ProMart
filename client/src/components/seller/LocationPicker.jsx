import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const LocationPicker = ({ setShowMap, setFormData }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  const initializeMap = () => {
    const google = window.google;
    if (!google || !google.maps) {
      console.error("Google Maps API not loaded");
      return;
    }

    const mapInstance = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 12.9716, lng: 77.5946 }, // Default location (Bangalore)
      zoom: 12,
    });

    const searchBoxInstance = new google.maps.places.SearchBox(document.getElementById("map-search"));
    mapInstance.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById("map-search"));

    mapInstance.addListener("click", (event) => {
      placeMarker(event.latLng, mapInstance);
    });

    searchBoxInstance.addListener("places_changed", () => {
      const places = searchBoxInstance.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      placeMarker(place.geometry.location, mapInstance);
    });

    setMap(mapInstance);
    setSearchBox(searchBoxInstance);
  };

  const placeMarker = (location, mapInstance) => {
    if (marker) marker.setMap(null); // Remove the previous marker

    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
    });

    setMarker(newMarker);
    mapInstance.setCenter(location);

    // Fetch the address from the Geocoding API
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat()},${location.lng()}&key=YOUR_GOOGLE_MAPS_API_KEY`
    )
      .then((response) => response.json())
      .then((data) => {
        const address = data.results[0]?.formatted_address || `${location.lat()}, ${location.lng()}`;
        setFormData((prev) => ({
          ...prev,
          address: address,
          latitude: location.lat(),
          longitude: location.lng(),
        }));
      })
      .catch((error) => {
        console.error("Error fetching address:", error);
      });
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Location</h2>
          <button
            onClick={() => setShowMap(false)}
            className="bg-red-500 text-white p-2 rounded-md"
          >
            <FaTimes />
          </button>
        </div>
        <input
          id="map-search"
          type="text"
          placeholder="Search for a location..."
          className="w-full p-2 border mb-2 rounded-md"
        />
        <div id="map" className="w-full h-64"></div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowMap(false)}
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