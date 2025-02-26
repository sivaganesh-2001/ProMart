import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { removeFromCart } from "../Redux/Cart/cart.actions";
import { MdDelete } from "react-icons/md";
import { db } from "../firebase"; // Firestore instance
import styles from "../styles/Cart.module.css";
import "react-toastify/dist/ReactToastify.css";
import { collection, query, where, getDocs } from "firebase/firestore";

const DELIVERY_CHARGE = 40;

const OrderPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shop, selectedProducts } = location.state;
  const [cartItems, setCartItems] = useState(selectedProducts);
  const customerEmail = localStorage.getItem("customerEmail");

  const [userAddress, setUserAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [editAddress, setEditAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    address: "",
    phone: "",
  });

  useEffect(() => {
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
            name:userData.name || "",
            address: userData.address || "",
            phone: userData.phone || "",
          }); 

          console.log("Name:", userData.name);
          console.log("Address:", userData.address);
          console.log("Mobile:", userData.phone);
        } else {
          setUserAddress(null);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [customerEmail]);

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
    if (!userAddress?.name || !userAddress?.address || !userAddress?.phone) {
      toast.warn("Please fill in all address fields before proceeding.");
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

    navigate(paymentType === "cod" ? "/order-review" : "/order-review-pay", {
      state: {
        cartItems,
        shop,
        userAddress,
        totalMRP,
        finalTotal,
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
    (total, [productId, qty]) => total + qty * shop.products.find((p) => p.id === productId).price,
    0
  );
  const finalTotal = totalMRP + DELIVERY_CHARGE;

  return (
    <div className="flex flex-col bg-[#F5F1F7] h-[100vh]">
      <div className="flex pl-[13%] pt-4 pb-3">
        <h2 className="text-[24px] font-semibold ">
          Order from {shop.shopName} ({Object.keys(cartItems).length} Items)
        </h2>
      </div>

      <div className="flex flex-row justify-center items-start gap-x-6">
        {/* Cart Section */}
        <div className="overflow-y-scroll h-[400px] w-[600px] p-4 bg-white rounded-lg shadow-lg">
          {Object.entries(cartItems).map(([productId, qty]) => {
            const product = shop.products.find((p) => p.id === productId);
            if (!product) return null;

            return (
              <div key={productId} className="border p-4 flex justify-between items-center bg-gray-100 rounded-lg mb-3">
                <img src={product.imageUrl} alt={product.productName} className="h-[80px] w-[80px] rounded-md object-cover" />

                <div className="ml-4 font-medium flex-1">
                  <p className="text-[16px]">{product.productName}</p>
                  <p className="font-semibold text-[18px]">₹{product.price}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(productId, -1)} className="bg-red-500 text-white px-3 py-1 rounded">-</button>
                  <p className="text-[16px]">{qty}</p>
                  <button onClick={() => updateQuantity(productId, 1)} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
                </div>
                
                <button
    onClick={() => handleRemove(productId)}
    className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center ml-4" // Added ml-4 for margin
  >
    <MdDelete className="text-[20px]" />
  </button>

              </div>
            );
          })}
        </div>

        {/* Price & Address Section */}
        <div className="border p-6 rounded-lg bg-white shadow-lg w-[300px]">
          <h3 className="text-lg font-semibold mb-4">Price Details</h3>
          <p>MRP: ₹{totalMRP}</p>
          <p>Delivery Fee: ₹{DELIVERY_CHARGE}</p>
          <p className="font-bold mt-2">Total: ₹{finalTotal}</p>


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
        <span className="material-icons mr-2">Address</span>
        <input
          type="text"
          placeholder="Address"
          value={tempAddress.address}
          className="border p-2 w-full rounded"
          onChange={(e) => setTempAddress({ ...tempAddress, address: e.target.value })}
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
        <p className="font-semibold">Name: {userAddress?.name}</p>
        <p>Address: {userAddress?.address}</p>
        <p>Mobile: {userAddress?.phone}</p>
      </div>
      <button
        onClick={() => { setTempAddress(userAddress); setEditAddress(true); }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Update Address
      </button>
    </div>
  )}
</div>
          <button onClick={() => validateAndProceed("cod")} className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 w-full">Cash on Delivery</button>
          <button onClick={() => validateAndProceed("online")} className="bg-green-500 text-white px-6 py-2 rounded-lg mt-2 w-full">Continue to Payment</button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
