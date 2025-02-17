export const getCart = () => {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : {};
  };
  
  export const saveCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  
  // Add product to the cart
  export const addProductToCart = (shopId, product) => {
    const cart = getCart();
  
    // If shop does not exist in cart, create entry
    if (!cart[shopId]) {
      cart[shopId] = { shopId, products: [] };
    }
  
    // Check if product already exists, update quantity if so
    const existingProduct = cart[shopId].products.find((p) => p.productId === product.productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart[shopId].products.push({ ...product, quantity: 1 });
    }
  
    saveCart(cart);
  };
  
  // Remove product from the cart
  export const removeProductFromCart = (shopId, productId) => {
    const cart = getCart();
  
    if (cart[shopId]) {
      cart[shopId].products = cart[shopId].products.filter((p) => p.productId !== productId);
  
      // Remove shop entry if no products left
      if (cart[shopId].products.length === 0) {
        delete cart[shopId];
      }
    }
  
    saveCart(cart);
  };
  
  // Get all items in cart
  export const getCartItems = () => getCart();
  