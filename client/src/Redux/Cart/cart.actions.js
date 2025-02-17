// cart.actions.js
import * as types from './cart.types';

export const addToCart = (item) => ({
  type: types.ADD_TO_CART,
  payload: item,
});

export const removeFromCart = (item) => ({
  type: types.REMOVE_FROM_CART,
  payload: item,
});
