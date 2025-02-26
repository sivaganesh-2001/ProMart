import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 20.5937, lng: 78.9629 }; // Default center (India)

const GoogleMapComponent = ({ onLocationSelect }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [map, setMap] = useState(null);

  // Handle map click to select location
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedPosition({ lat, lng });
    onLocationSelect({ lat, lng });
  };

  // Handle search box place selection
  const handlePlaceSelect = () => {
    const place = searchBox.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setSelectedPosition({ lat, lng });
      onLocationSelect({ lat, lng });
      map.panTo({ lat, lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={["places"]}>
      <div style={{ marginBottom: "10px" }}>
        <Autocomplete
          onLoad={(ref) => setSearchBox(ref)}
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Search for a location..."
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedPosition || center}
        zoom={selectedPosition ? 14 : 5}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        {selectedPosition && <Marker position={selectedPosition} />}
      </GoogleMap>

      {selectedPosition && (
        <button
          onClick={() => alert(`Selected Location: ${selectedPosition.lat}, ${selectedPosition.lng}`)}
          style={{
            marginTop: "10px",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Select Location
        </button>
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;
