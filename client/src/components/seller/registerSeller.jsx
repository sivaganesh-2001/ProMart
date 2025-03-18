import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation to OTP Page
import { storage, auth } from "../../firebase"; // Firebase storage & authentication
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";
import LocationPicker from "./LocationPicker"; // Adjust the path as needed

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    categories: [], // Store selected category IDs
    customCategory: "",
    password: "",
    confirmPassword: "",
    shopImage: null,
    imagePreview: null, // Preview state for the image
    latitude: null,
    longitude: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [usingCurrentLocation, setUsingCurrentLocation] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setFormData((prev) => ({ ...prev, email: user.email })); // Set the email in formData
      }
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/categories"); // Adjust the URL as needed
        setCategoriesList(response.data); // Assuming response.data is an array of category objects
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        shopImage: file,
        imagePreview: URL.createObjectURL(file), // Set the image preview
      });
    }
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(categoryId);
      let updatedCategories;

      if (isSelected) {
        // Remove category if already selected
        updatedCategories = prev.categories.filter((id) => id !== categoryId);
      } else {
        // Check if "Other" is selected
        if (categoryId === "other") {
          updatedCategories = [...prev.categories, categoryId];
        } else if (prev.categories.length < 3) {
          // Only add if less than 3 categories are selected
          updatedCategories = [...prev.categories, categoryId];
        } else {
          alert("You can only select up to 3 categories.");
          return prev; // Do nothing if already 3 categories are selected
        }
      }

      return {
        ...prev,
        categories: updatedCategories,
      };
    });
  };

  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `shop_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.shopName ||
      !formData.ownerName ||
      !formData.email ||
      formData.password !== formData.confirmPassword ||
      !formData.shopImage ||
      formData.categories.length === 0
    ) {
      setError("Please fill out all required fields correctly and upload the shop image.");
      return;
    }

    try {
      setLoading(true);

      // Upload shop image and get URL
      const imageUrl = await uploadImageToFirebase(formData.shopImage);

      const currentUser   = auth.currentUser  ;
      if (!currentUser  ) {
        setError("User   not found");
        return;
      }

      // Prepare seller data
      const sellerData = {
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        categories: formData.categories, // Ensure categories is an array of category IDs
        shopImageUrl: imageUrl,
        location: { x: formData.longitude, y: formData.latitude },
      };

      console.log("Sending Seller Data:", sellerData); // Debugging

      // Send the data to the backend
      await axios.post("http://localhost:8081/api/sellers/approve-seller", sellerData);
      alert("Seller registered successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register seller");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Use a geocoding API (for example, Google Maps API) to get the address from coordinates
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw  `
        )
          .then((response) => response.json())
          .then((data) => {
            const address = data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
            setFormData({
              ...formData,
              address: address, // Set the address text field to the current location
              latitude: latitude,
              longitude: longitude,
            });
            setUsingCurrentLocation(true);
            setShowMap(false); // Close the map if it was open
          })
          .catch((error) => {
            alert("Error fetching location data");
          });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Seller Registration</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Shop Image Upload */}
      <div className="flex justify-center mb-4">
        <label htmlFor="shopImage" className="cursor-pointer">
          <img
            src={formData.imagePreview || "/images/shop-image.png"} // Show preview or default image
            alt="Shop"
            className="w-32 h-32 rounded-full object-cover"
          />
        </label>
        <input
          type="file"
          id="shopImage"
          name="shopImage"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
          required
        />
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label className="block">Shop Name:</label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block">Owner Name:</label>
          <input
            type="text"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        {/* Email Display (Read-only) */}
        <div>
          <label className="block">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email} // Bind to the formData email
            onChange={handleChange}
            readOnly
            className="w-full border p-2 rounded-md bg-gray-200 text-gray-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block">Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block">Shop Address:</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={handleCurrentLocation}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Use Current Location
            </button>
            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Select Location
            </button>
          </div>
          <textarea
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border p-2 rounded-md"
            rows="3"
            required
          />
        </div>

        {/* Categories Selection */}
        <div className="relative">
          <label className="block">Categories</label>
          <div
            className="relative border p-2 rounded-md flex justify-between items-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>
              {formData.categories.length > 0
                ? categoriesList
                    .filter((cat) => formData.categories.includes(cat.id)) // Use category.id
                    .map((cat) => cat.name)
                    .join(", ") + (formData.categories.includes("other") ? ", Other" : "")
                : "Select Categories"}
            </span>
            <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>

          {dropdownOpen && (
            <div className="absolute left-0 w-full bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto z-10">
              {categoriesList.map((category) => (
                <label
                  key={category.id} // Use category.id
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category.id)} // Use category.id
                    onChange={() => handleCategoryChange(category.id)} // Use category.id
                  />
                  <span>{category.name}</span>
                </label>
              ))}
              {/* Add the "Other" option */}
              <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.categories.includes("other")} // Check if "Other" is selected
                  onChange={() => handleCategoryChange("other")} // Handle "Other" selection
                />
                <span>Other</span>
              </label>
            </div>
          )}
        </div>

        {/* Map Picker */}
        {showMap && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <LocationPicker setShowMap={setShowMap} setFormData={setFormData} />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-md w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default SellerRegistration;