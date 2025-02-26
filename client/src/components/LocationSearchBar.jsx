// LocationSearchBar.js
import React from "react";

const LocationSearchBar = ({ searchQuery, setSearchQuery, fetchLocationSuggestions }) => {
  return (
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
  );
};

export default LocationSearchBar;