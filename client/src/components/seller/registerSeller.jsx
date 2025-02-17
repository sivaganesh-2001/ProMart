import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation to OTP Page
import { storage, auth, db } from "../../firebase"; // Firebase storage & authentication
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore"; // For updating user role in Firestore
import axios from "axios";
import { FaChevronDown } from "react-icons/fa";


// Categories List (Can be modified easily)
const allCategories = [
  "Grocery",
  "Beauty",
  "Meat",
  "Vegetables",
  "Fitness",
  "Gift",
  "Petcare",
  "Party",
  "Kitchen",
  // "Toys & Games",
  // "Automobiles",
  // "Sports & Fitness",
  // "Jewelry & Accessories",
  // "Handmade & Crafts",
  // "Pet Supplies",
  // "Gardening",
  // "Others",
];

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    categories: [],
    customCategories: "",
    password: "",
    confirmPassword: "",
    shopImage: null,
    imagePreview: null, // Preview state for the image
    latitude:null,
    longitude:null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const navigate = useNavigate(); // For navigating to OTP page
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        setUserEmail(user.email); // Set the email here
        setFormData((prev) => ({ ...prev, email: user.email })); // Set the email in formData
      }
    });

    // Cleanup the listener when the component is unmounted
    return () => unsubscribe();
  }, []); // Ensure this runs only once when the component is mounted

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

  const handleCategoryChange = (category) => {
    let updatedCategories = [...formData.categories];

    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((cat) => cat !== category);
    } else {
      if (updatedCategories.length < 3) {
        updatedCategories.push(category);
      } else {
        alert("You can select up to 3 categories only.");
        return;
      }
    }

    setFormData({ ...formData, categories: updatedCategories });
  };

  
  const handleCustomCategoryChange = (e) => {
    // Allow only letters and spaces for custom category
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    setFormData({
      ...formData,
      customCategory: value,
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
  
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("User not found");
        return;
      }
  
      // Update role to seller in Firestore
      // const userRef = doc(db, "users", currentUser.uid);
      // await updateDoc(userRef, { role: "seller" });
  
      // Prepare seller data
      const sellerData = {
        shopName: formData.shopName,
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        categories: formData.categories, // Ensure categories is an array
        shopImageUrl: imageUrl,
        location: { x: formData.longitude, y: formData.latitude },
      };
  
      console.log("Sending Seller Data:", sellerData); // Debugging
  
      // Send the data to the backend

      // await axios.post("http://localhost:8081/api/sellers", sellerData);
      // alert("Seller registered successfully!");

      

      await axios.post("http://localhost:8081/api/sellers/approve-seller", sellerData);
      alert("Seller registered successfully!");


      // navigate("/otp"); // Redirect to OTP page
    } catch (error) {
      setError(error.response?.data?.message || "Failed to register seller");
    } finally {
      setLoading(false);
    }
  };
  

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        // Use a geocoding API (for example, Google Maps API) to get the address from coordinates
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAiEvhHmhIdeKSVUF2DqUEVKdWi3LOOjIw`
        )
          .then((response) => response.json())
          .then((data) => {
            const address = data.results[0]?.formatted_address || `${latitude}, ${longitude}`;
            setFormData({
              ...formData,
              location: address,
              address: address, // Set the address text field to the current location
              latitude:latitude,
              longitude:longitude,
            });
            setUseCurrentLocation(true);
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


        {/* <div>
          <label className="block">Shop Address:</label>
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={handleLocation}
              className="bg-green-500 text-white p-2 rounded-md"
            >
              Use Current Location
            </button>
            {useCurrentLocation ? (
              <p className="text-sm text-gray-500">{formData.location}</p>
            ) : (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
                rows="3"
              />
            )}
          </div>
        </div> */}


        <div>
          <label className="block">Shop Address:</label>
          <button type="button" onClick={handleLocation} className="bg-green-500 text-white p-2 rounded-md">
            Use Current Location
          </button>
          <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded-md" rows="3" required />
        </div>


        <div className="relative">
      <div className="relative">
          <label className="block">Categories </label>
          <div className="relative border p-2 rounded-md flex justify-between items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span>{formData.categories.length > 0 ? formData.categories.join(", ") : "Select Categories"}</span>
            <FaChevronDown className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </div>

          {dropdownOpen && (
            <div className="absolute left-0 w-full bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto z-10">
              {allCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer">
                  <input type="checkbox" checked={formData.categories.includes(category)} onChange={() => handleCategoryChange(category)} />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Custom Category Input */}
        {formData.categories.includes("Others") && (
          <div>
            <label className="block">Custom Category:</label>
            <input type="text" name="customCategory" value={formData.customCategory} onChange={handleCustomCategoryChange} className="w-full border p-2 rounded-md" required />
          </div>
        )}
        </div>

        {/* <div>
          <label className="block">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
            required
          />
        </div> */}

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
