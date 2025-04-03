import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentComponent = ({ finalTotal, userAddress, customerEmail, shop }) => {
    const navigate = useNavigate();
    const isTestMode = true; // Set this to false in production

    const handleOnlinePayment = async () => {
        if (!userAddress?.name || !userAddress?.address || !userAddress?.phone) {
            toast.warn("Please fill in all address fields before proceeding.");
            return;
        }

        try {
            // Make an API call to your backend to create an order with Razorpay
            const response = await axios.post("http://localhost:8081/api/payment/initiate", {
                amount: finalTotal * 100, // Amount in paise
                currency: "INR",
                receipt: "receipt#1", // Optional
            });

            console.log("Payment initiation response:", response.data);

            const { id: orderId, amount, currency, status } = response.data;

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
                    console.log("Payment successful:", response);
                    toast.success("Payment successful!");

                    if (!isTestMode) {
                        // Verify payment with backend (Only in production)
                        await axios.post("http://localhost:8081/api/payment/verify", {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });
                    } else {
                        // Simulate successful verification in test mode
                        console.log("Skipping payment verification in test mode.");
                    }

                    // Navigate to cart page after successful payment
                    navigate("/cart");
                    toast.success("Order placed successfully!");
                },
                prefill: {
                    name: userAddress.name,
                    email: customerEmail,
                    contact: userAddress.phone,
                },
                theme: {
                    color: "#F37254",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Error initiating payment:", error);
            toast.error("Failed to initiate payment.");
        }
    };

    return (
        <div>
            <h2>Complete Your Payment</h2>
            <button onClick={handleOnlinePayment}>Pay Now</button>
        </div>
    );
};

export default PaymentComponent;
