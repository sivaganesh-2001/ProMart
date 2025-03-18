import React, { useState } from "react";
import axios from "axios";

const SearchBar = ({ setSearchTerm, setMarker, map }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Get User Location
  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  React.useEffect(() => {
    getUserLocation();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8081/api/maps/autocomplete", {
        params: {
          input: query,
          lat: location.lat || 0, // Default to 0 if not available
          lng: location.lng || 0,
        },
      });

      if (response.data.predictions) {
        setSuggestions(response.data.predictions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching place suggestions:", error);
    }
  };

  const handleSuggestionClick = async (placeId) => {
    try {
      const response = await axios.get("http://localhost:8081/api/maps/place/details", {
        params: {
            placeId: placeId,
        },
    });
      if (response.data.status === "OK") {
        const location = response.data.result.geometry.location;
        const latLng = new window.google.maps.LatLng(location.lat, location.lng);
        setMarker(latLng);
        map.panTo(latLng);
        setSearchTerm(response.data.result.formatted_address);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search for a location..."
        className="w-full p-2 border rounded-md"
        onChange={handleSearch}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSuggestionClick(suggestion.place_id)}
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
