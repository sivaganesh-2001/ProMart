import * as types from './cart.types';

const initialState = {
  cart: [], // Default empty array for cart
};

const reducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.ADD_TO_CART:
      // Find or create the customer cart
      let customerCart = state.cart.find(item => item.customerEmail === payload.email);
      if (!customerCart) {
        customerCart = { customerEmail: payload.email, shops: [] };
        state = { ...state, cart: [...state.cart, customerCart] }; // Create a new state with the new customer cart
      }

      // Find or create the shop in the customer's cart
      let shop = customerCart.shops.find(shop => shop.shopId === payload.shopId);
      if (!shop) {
        shop = { shopId: payload.shopId, products: [] };
        customerCart.shops = [...customerCart.shops, shop]; // Create a new array with the new shop
      }

      // Find or create the product in the shop
      let product = shop.products.find(product => product.productId === payload.productId);
      if (!product) {
        product = { productId: payload.productId, quantity: 0 };
        shop.products = [...shop.products, product]; // Create a new array with the new product
      }

      // Update the product quantity
      product.quantity += payload.quantity;

      // If the quantity is zero or less, remove the product
      if (product.quantity <= 0) {
        shop.products = shop.products.filter(product => product.productId !== payload.productId);
      }

      // If there are no products in the shop, remove the shop
      if (shop.products.length === 0) {
        customerCart.shops = customerCart.shops.filter(shop => shop.shopId !== payload.shopId);
      }

      // If there are no shops for the customer, remove the customer cart
      if (customerCart.shops.length === 0) {
        state = { ...state, cart: state.cart.filter(item => item.customerEmail !== payload.email) };
      }

      return { ...state };

    case types.REMOVE_FROM_CART:
      let cartToRemove = state.cart.find(item => item.customerEmail === payload.email);
      if (!cartToRemove) return state;

      let shopToRemove = cartToRemove.shops.find(shop => shop.shopId === payload.shopId);
      if (!shopToRemove) return state;

      let productToRemove = shopToRemove.products.find(product => product.productId === payload.productId);
      if (!productToRemove) return state;

      productToRemove.quantity -= payload.quantity;

      if (productToRemove.quantity <= 0) {
        shopToRemove.products = shopToRemove.products.filter(product => product.productId !== payload.productId);
      }

      if (shopToRemove.products.length === 0) {
        cartToRemove.shops = cartToRemove.shops.filter(shop => shop.shopId !== payload.shopId);
      }

      if (cartToRemove.shops.length === 0) {
        state = { ...state, cart: state.cart.filter(item => item.customerEmail !== payload.email) };
      }

      return { ...state };

    default:
      return state;
  }
};

export { reducer };
