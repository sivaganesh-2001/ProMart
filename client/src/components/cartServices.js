// src/components/cartServices.js

// Update Cart function (already defined)
export const updateCart = async (email, shopId, productId, quantity) => {
    try {
      const response = await fetch('http://localhost:8081/api/cart/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`  // If using JWT
        },
        body: JSON.stringify({
          email,        // Send the email as part of the request body
          shopId,
          productId,
          quantity
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update cart');
      }
  
      return response.json();
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };
  
  // Get Cart (ensure it's defined)
// Assuming you have an API endpoint to get the cart
export const getCart = async (email) => {
    try {
      const response = await fetch(`/api/cart/${email}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
  
      const cartData = await response.json(); // Assuming the response returns cart data
      return cartData;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  
  
  
  // Clear Cart function (ensure it's defined)
  export const clearCart = async (email) => {
    try {
      const response = await fetch('http://localhost:8080/api/cart/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }
  
      return response.json();
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };
  
  // Assuming you have a backend API to clear the cart

  