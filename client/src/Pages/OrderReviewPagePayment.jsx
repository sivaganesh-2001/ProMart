import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { db } from "../firebase"; // Firestore instance
import { collection, query, where, getDocs } from "firebase/firestore";

const PLATFORM_FEE = 10; // Define platform fee

function OrderReviewPagePayment() {
  const navigate = useNavigate();
  const location = useLocation();

  const customerEmail = localStorage.getItem("customerEmail");
  const [fetchedAddress, setFetchedAddress] = useState(null);

  // Destructure the state from location
  const { shop, cartItems, userAddress, totalMRP, finalTotal, deliveryCharge } = location.state || {};

  useEffect(() => {
    const fetchAddressFromFirestore = async () => {
      try {
        const q = query(collection(db, "users"), where("email", "==", customerEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setFetchedAddress({
            address: userData.address || "",
            phone: userData.phone || "",
          });
        } else {
          toast.warn("No saved address found. Please update your address.");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    fetchAddressFromFirestore();
  }, [customerEmail]); // Only run this effect when customerEmail changes


  // If location.state is not available, navigate back to the order page
  if (!location.state) {
    toast.error("No order details found. Please go back and try again.");
    navigate("/order"); // Navigate back to the order page if no details are found
    return null; // Prevent rendering the component
  }

  // Fetch address from Firestore

  const handleOnlinePayment = async () => {
    if (!userAddress?.name || !userAddress?.address || !userAddress?.phone) {
      toast.warn("Please fill in all address fields before proceeding.");
      return;
    }

    try {
      // Make an API call to your backend to create an order with Razorpay
      const response = await axios.post("http://localhost:8081/api/payment/initiate", {
        amount: (finalTotal + PLATFORM_FEE) * 100, // Amount in paise, including platform fee
        currency: "INR",
        receipt: "receipt#1", // Optional
      });

      const { id: orderId, amount, currency } = response.data;

      // Check if amount is defined
      if (!amount) {
        throw new Error("Amount is undefined in the response");
      }

      // Initialize Razorpay
      const options = {
        key: "rzp_test_FPceTimKpYjsFE", // Razorpay test key
        amount: amount.toString(), // Amount in paise
        currency: currency,
        name: shop.shopName,
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          toast.success("Payment successful!");
          await placeOrder();
        },
        prefill: {
          name: userAddress.name,
          email: customerEmail,
          contact: userAddress.phone,
        },
        theme: {
          color: "#057fd6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  const placeOrder = async () => {
    if (!fetchedAddress?.address || !fetchedAddress?.phone || !userAddress?.name) {
      toast.warn("Please add a valid address and name before confirming the order.");
      return;
    }

    if (!shop?.id) {
      toast.error("Shop information is missing.");
      return;
    }

    const orderDetails = {
      customerEmail: customerEmail,
      sellerId: shop.id, // Include the seller ID for backend processing
      items: Object.entries(cartItems).map(([productId, qty]) => {
        const product = shop.products.find((p) => p.id === productId);
        return {
          productId,
          productName: product?.productName || "Unknown Product",
          price: product?.price || 0,
          quantity: qty,
        };
      }),
      totalAmount: finalTotal + PLATFORM_FEE, // Include platform fee in total amount
      paymentMethod: "Online Payment", // Change this if needed
      address: fetchedAddress.address,
      phone: fetchedAddress.phone,
      customerName: userAddress.name, // Include customer name
      status: "Pending"
    };

    try {
      const response = await fetch(`http://localhost:8081/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to place order: ${errorData.message || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      toast.success("Order Confirmed Successfully!");

      await fetch(`http://localhost:8081/api/cart/delete-shop`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customerEmail, shopId: shop.id }),
      });

      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to confirm order. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center bg-[#F5F1F7] min-h-screen p-6">
      <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        {/* Delivery Address Section */}
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">Delivery Address</h3>
        <p><strong>Name:</strong> {userAddress?.name}</p>
        <p><strong>Address:</strong> {fetchedAddress?.address}</p>
        <p><strong>Mobile:</strong> {fetchedAddress?.phone}</p>

        {/* Items Ordered Section */}
        <h3 className="text-xl font-semibold border-b pb-2 mt-6">Items Ordered</h3>
        {Object.entries(cartItems).map(([productId, qty], index) => {
          const product = shop.products.find((p) => p.id === productId);
          if (!product) return null;
          return (
            <div key={index} className="flex justify-between py-2 border-b">
              <div>
                <p><strong>{product.productName}</strong></p>
                <p>Quantity: {qty}</p>
              </div>
              <span className="font-semibold">₹{product.price * qty}</span>
            </div>
          );
        })}

        {/* Price Details Section */}
        <div className="mt-6">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>₹{totalMRP}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Delivery Fee:</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Platform Fee:</span>
            <span>₹{PLATFORM_FEE}</span>
          </div>
          <div className="flex justify-between py-2 font-bold text-lg">
            <span>Total Amount:</span>
            <span>₹{finalTotal + PLATFORM_FEE}</span> {/* Add platform fee to total */}
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handleOnlinePayment}
          className="w-full bg-blue-500 text-white py-3 mt-6 rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

export default OrderReviewPagePayment;