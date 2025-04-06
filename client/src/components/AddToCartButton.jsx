import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Redux/Cart/cart.actions";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddToCartButton = ({ product, shopId, stockStatus }) => {
  const dispatch = useDispatch();

  // Retrieve customer email from localStorage
  const customerEmail = localStorage.getItem("customerEmail");

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (stockStatus === "Out of Stock") {
      toast.error("Product sold out"); // Show error and prevent further actions
      return;
    }

    if (!customerEmail) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    // Prepare the cart item data
    const cartItem = {
      email: customerEmail,
      shopId,
      productId: product.id,
      change: 1,
    };

    console.log("Sending to backend:", cartItem);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/cart/update",
        cartItem,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response from backend:", response.data);

      // Dispatch the action to update Redux store
      dispatch(addToCart(cartItem));

      // Show toast notification
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`px-6 py-3 rounded-md text-lg font-semibold transition ${
        stockStatus === "Out of Stock"
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-[#FF3269] text-white"
      }`}
      disabled={stockStatus === "Out of Stock"}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;
