import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { removeFromCart } from "../Redux/Cart/cart.actions";
import { MdDelete } from "react-icons/md";
import { db } from "../firebase"; // Firestore instance
import "react-toastify/dist/ReactToastify.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import LocationPicker from "../components/seller/LocationPickerAddress"; // Import the LocationPicker component

const OrderPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shop, selectedProducts, shopId } = location.state;
  const [cartItems, setCartItems] = useState(selectedProducts);
  const customerEmail = localStorage.getItem("customerEmail");

  const [userAddress, setUserAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [editAddress, setEditAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [showMap, setShowMap] = useState(false);
  const [deliveryCoordinates, setDeliveryCoordinates] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0); // Start with 0
  const [shopDetails, setShopDetails] = useState(null); // State to hold shop details
  const [shopLocation, setShopLocation] = useState(null); // State to hold shop location
  const [loadingShop, setLoadingShop] = useState(true); // Loading state for shop

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchShopDetails(); // Fetch shop details in background
        await fetchAddress(); // Fetch address after or in parallel
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data.");
      }
    };

    const fetchAddress = async () => {
      if (!customerEmail) {
        console.error("Customer email is undefined!");
        return;
      }

      try {
        const q = query(collection(db, "users"), where("email", "==", customerEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setUserAddress({
            name: userData.name || "",
            address: userData.address || "",
            phone: userData.phone || "",
          });
        } else {
          setUserAddress(null);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    const fetchShopDetails = async () => {
      setLoadingShop(true);
      try {
        const response = await axios.get(`http://localhost:8081/api/sellers/id/${shopId}`);
        setShopDetails(response.data);
        if (response.data.location) {
          const loc = response.data.location;
          setShopLocation({
            lat: loc.y, // Latitude from 'y'
            lng: loc.x, // Longitude from 'x'
          });
        } else if (shop.location) {
          setShopLocation({
            lat: shop.location.y || shop.location.lat,
            lng: shop.location.x || shop.location.lng,
          });
        } else {
          toast.error("Shop location is not available.");
        }
        console.log("Shop Location Set:", { lat: response.data.location?.y, lng: response.data.location?.x });
      } catch (error) {
        console.error("Error fetching shop details:", error);
        toast.error("Failed to fetch shop details.");
      } finally {
        setLoadingShop(false);
      }
    };

    fetchData();
  }, [customerEmail, shopId, shop]);

  const calculateDistance = (shopLoc, deliveryLoc) => {
    // Extract latitude and longitude, handling both 'lat/lng' and 'latitude/longitude' formats
    const shopLat = shopLoc.lat ?? shopLoc.latitude;
    const shopLng = shopLoc.lng ?? shopLoc.longitude;
    const deliveryLat = deliveryLoc.lat ?? deliveryLoc.latitude ?? parseFloat(deliveryLoc.address?.split(",")[0]);
    const deliveryLng = deliveryLoc.lng ?? deliveryLoc.longitude ?? parseFloat(deliveryLoc.address?.split(",")[1]);

    // Ensure both locations have valid lat/lng values
    if (
      !shopLat || !shopLng || !deliveryLat || !deliveryLng ||
      isNaN(shopLat) || isNaN(shopLng) || isNaN(deliveryLat) || isNaN(deliveryLng)
    ) {
      console.error("Invalid coordinates:", { shopLoc, deliveryLoc });
      return 0; // Return 0 if coordinates are invalid
    }

    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(deliveryLat - shopLat);
    const dLng = toRad(deliveryLng - shopLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(shopLat)) * Math.cos(toRad(deliveryLat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const updateDeliveryCharge = (newDeliveryCoords) => {
    if (loadingShop) {
      toast.warn("Please wait while shop location is loading...");
      return;
    }

    if (!shopLocation) {
      toast.error("Shop location is not available. Please try again later.");
      return;
    }

    // Normalize the delivery coordinates to ensure consistent keys
    const normalizedDeliveryCoords = {
      lat: newDeliveryCoords.latitude ?? parseFloat(newDeliveryCoords.address?.split(",")[0]),
      lng: newDeliveryCoords.longitude ?? parseFloat(newDeliveryCoords.address?.split(",")[1]),
      address: newDeliveryCoords.address, // Keep the address if needed
    };

    const distance = calculateDistance(shopLocation, normalizedDeliveryCoords);

    if (distance === 0) {
      toast.error("Unable to calculate distance. Please select a valid location.");
      return;
    }

    if (distance > 30) {
      toast.error("Delivery distance should be within 30 km.");
      setDeliveryCoordinates(null);
      setDeliveryCharge(0);
      return;
    }

    if (distance <= 4) {
      setDeliveryCharge(40);
    } else {
      setDeliveryCharge(Math.ceil(distance) * 10);
    }

    setDeliveryCoordinates(normalizedDeliveryCoords);
    console.log("Delivery Coordinates Set:", normalizedDeliveryCoords);
    console.log("Calculated Distance:", distance, "Delivery Charge:", deliveryCharge);
  };

  const updateQuantity = async (productId, change) => {
    const newQuantity = (cartItems[productId] || 0) + change;
    setCartItems((prevCart) => {
      const updatedCart = { ...prevCart };
      if (newQuantity <= 0) {
        delete updatedCart[productId];
      } else {
        updatedCart[productId] = newQuantity;
      }
      return updatedCart;
    });

    try {
      await axios.post("http://localhost:8081/api/cart/update", {
        email: customerEmail,
        shopId: shop.id,
        productId,
        change,
      });

      if (newQuantity === 0) {
        await axios.post("http://localhost:8081/api/cart/remove", {
          email: customerEmail,
          shopId: shop.id,
          productId,
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    updateQuantity(productId, -cartItems[productId]);
  };

  const validateAndProceed = (paymentType) => {
    if (loadingShop || !userAddress?.name || !userAddress?.address || !userAddress?.phone) {
      toast.warn("Please wait for shop details to load and fill in all address fields before proceeding.");
      return;
    }

    if (!deliveryCoordinates) {
      toast.warn("* Please select a delivery location on the map before proceeding. This is mandatory.");
      return;
    }

    if (userAddress.name.length < 3) {
      toast.warn("Name should be at least 3 characters long.");
      return;
    }

    if (!/^\d{10}$/.test(userAddress.phone)) {
      toast.warn("Invalid mobile number. It should be 10 digits.");
      return;
    }

    const totalMRP = Object.entries(cartItems).reduce(
      (total, [productId, qty]) => total + qty * shop.products.find((p) => p.id === productId).price,
      0
    );
    const finalTotal = totalMRP + deliveryCharge;

    navigate("/order-review", {
      state: {
        cartItems,
        shop,
        userAddress,
        totalMRP,
        finalTotal,
        deliveryCharge,
        deliveryCoordinates,
      },
    });
  };

  const validateAndPay = (paymentType) => {
    if (loadingShop || !userAddress?.name || !userAddress?.address || !userAddress?.phone) {
      toast.warn("Please wait for shop details to load and fill in all address fields before proceeding.");
      return;
    }

    if (!deliveryCoordinates) {
      toast.warn("* Please select a delivery location on the map before proceeding. This is mandatory.");
      return;
    }

    if (userAddress.name.length < 3) {
      toast.warn("Name should be at least 3 characters long.");
      return;
    }

    if (!/^\d{10}$/.test(userAddress.phone)) {
      toast.warn("Invalid mobile number. It should be 10 digits.");
      return;
    }

    const totalMRP = Object.entries(cartItems).reduce(
      (total, [productId, qty]) => total + qty * shop.products.find((p) => p.id === productId).price,
      0
    );
    const finalTotal = totalMRP + deliveryCharge;

    navigate("/order-review-pay", {
      state: {
        cartItems,
        shop,
        userAddress,
        totalMRP,
        finalTotal,
        deliveryCharge,
        deliveryCoordinates,
      },
    });
  };

  const handleSaveAddress = () => {
    if (!tempAddress.name || tempAddress.name.length < 3) {
      toast.warn("Name should be at least 3 characters long.");
      return;
    }

    if (!tempAddress.address) {
      toast.warn("Address cannot be empty!");
      return;
    }

    if (!/^\d{10}$/.test(tempAddress.phone)) {
      toast.warn("Invalid mobile number. It should be 10 digits.");
      return;
    }
    setUserAddress(tempAddress);
    setEditAddress(false);
  };

  const totalMRP = Object.entries(cartItems).reduce(
    (total, [productId, qty]) => {
      const product = shop.products.find((p) => p.id === productId);
      return product ? total + qty * product.price : total;
    },
    0
  );

  const finalTotal = totalMRP + deliveryCharge;

  return (
    <div className="flex flex-col bg-[#F5F1F7] h-[100vh]">
      <div className="flex pl-[13%] pt-4 pb-3">
        <h2 className="text-[24px] font-semibold">
          Order from {shop.shopName} ({Object.keys(cartItems).length} Items)
        </h2>
      </div>

      <div className="flex flex-row justify-center items-start gap-x-6">
        {/* Left Column: Stacked Cards */}
        <div className="flex flex-col gap-6 w-[600px]">
          {/* Cart Section */}
          <div className="overflow-y-auto h-[400px] p-4 bg-white rounded-lg shadow-lg">
            {Object.entries(cartItems).map(([productId, qty]) => {
              const product = shop.products.find((p) => p.id === productId);
              if (!product) return null;

              return (
                <div key={productId} className="border p-4 flex justify-between items-center bg-gray-100 rounded-lg mb-3">
                  <img src={product.imageUrl} alt={product.productName} className="h-[80px] w-[80px] rounded-md object-cover" />
                  <div className="ml-4 font-medium flex-1">
                    <p className="text-[16px]">{product.productName}</p>
                    <div className="flex justify-start items-center">
                      <p className="text-[16px] mr-2">{product.netQuantity}</p>
                      <p className="text-[16px]">{product.unit}</p>
                    </div>
                    <p className="font-semibold text-[18px] text-left">₹{product.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(productId, -1)} className="bg-red-500 text-white px-3 py-1 rounded">-</button>
                    <p className="text-[16px]">{qty}</p>
                    <button onClick={() => updateQuantity(productId, 1)} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
                  </div>
                  <button
                    onClick={() => handleRemove(productId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center ml-4"
                  >
                    <MdDelete className="text-[20px]" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mandatory Delivery Location Card (Shrunk) */}
          <div className="h-[150px] p-4 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => setShowMap(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
              disabled={loadingShop}
            >
              {loadingShop ? "Loading..." : "Select Delivery Location"}
            </button>

            {deliveryCoordinates && shopLocation && !loadingShop && (
              <div className="mt-2">
                <p><strong>Selected Location:</strong> {deliveryCoordinates.address}</p>
                <p><strong>Distance from Shop:</strong> {calculateDistance(shopLocation, deliveryCoordinates).toFixed(2)} km</p>
              </div>
            )}
          </div>
        </div>

        {/* Price & Address Section */}
        <div className="border p-6 rounded-lg bg-white shadow-lg w-[300px] h-[610px] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Price Details</h3>
            <p>MRP: ₹{totalMRP}</p>
            <p>Delivery Fee: {!deliveryCoordinates ? "Select Delivery Location" : `₹${deliveryCharge}`}</p>
            <p className="font-bold mt-2">Total: {!deliveryCoordinates ? "Select Delivery Location" : `₹${finalTotal}`}</p>

            <div className="mt-4 border p-4 rounded-lg bg-gray-100 shadow-md">
              <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
              {editAddress ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <span className="material-icons mr-2">Name</span>
                    <input
                      type="text"
                      placeholder="Name"
                      value={tempAddress.name}
                      className="border p-2 w-full rounded"
                      onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons mr-2">Phone</span>
                    <input
                      type="text"
                      placeholder="Mobile No"
                      value={tempAddress.phone}
                      className="border p-2 w-full rounded"
                      onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="material-icons mr-2">Address</span>
                    <input
                      type="text"
                      placeholder="Address"
                      value={tempAddress.address}
                      className="border p-2 w-full rounded"
                      onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition duration-200"
                  >
                    Save Address
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="border p-4 rounded-lg bg-white shadow-sm">
                    <p>
                      <span className="font-semibold">Name: </span>
                      {userAddress?.name || "Not set"}
                    </p>
                    <p>
                      <span className="font-semibold">Mobile: </span>
                      {userAddress?.phone || "Not set"}
                    </p>
                    <p>
                      <span className="font-semibold">Address: </span>
                      {userAddress?.address || "Not set"}
                    </p>
                  </div>
                  <button
                    onClick={() => { setTempAddress(userAddress || { name: "", address: "", phone: "" }); setEditAddress(true); }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Update Address
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={() => validateAndProceed("cod")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 w-full cursor-pointer"
            >
              Cash on Delivery
            </button>
            <button
              onClick={validateAndPay}
              className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4 w-full cursor-pointer"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>

      {showMap && (
        <LocationPicker
          setShowMap={setShowMap}
          setDeliveryCoordinates={(coords) => updateDeliveryCharge(coords)}
          setDeliveryCharge={setDeliveryCharge}
          shopLocation={shopLocation}
          loadingShop={loadingShop}
        />
      )}
    </div>
  );
};

export default OrderPage;