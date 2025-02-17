import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/Cart/cart.actions';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddToCartButton = ({ product, shopId, setCartCount }) => {
  const dispatch = useDispatch();

  // Retrieve customer email from localStorage
  const customerEmail = localStorage.getItem('customerEmail');

  // Handle Add to Cart
  const handleAddToCart = async () => {
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
      const response = await axios.post('http://localhost:8081/api/cart/update', cartItem, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("Response from backend:", response.data);

      // Dispatch the action to update Redux store
      dispatch(addToCart(cartItem));

      // Fetch the updated cart count after adding the item
      fetchCartCount(customerEmail);

      // Show toast notification
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // Fetch updated cart count
  const fetchCartCount = async (customerEmail) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/cart/count`, 
        { params: { userId: customerEmail } }
      );
      console.log('CartCount:', response.data);
      setCartCount(response.data);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className="bg-[#FF3269] text-white px-6 py-3 rounded-md text-lg font-semibold"
      >
        Add to Cart
      </button>
    </>
  );
};

export default AddToCartButton;
