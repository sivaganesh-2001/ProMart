package com.example.promart.service;

import com.example.promart.dto.CartUpdateRequest;
import com.example.promart.model.Cart;
import com.example.promart.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart updateCart(CartUpdateRequest request) {
        Optional<Cart> cartOptional = cartRepository.findByEmail(request.getEmail());
        Cart cart = cartOptional.orElse(new Cart(request.getEmail(), new HashMap<>()));
    
        Map<String, Map<String, Integer>> shops = cart.getShops();
        shops.putIfAbsent(request.getShopId(), new HashMap<>());  // Ensure shop exists
    
        Map<String, Integer> products = shops.get(request.getShopId());
        products.put(request.getProductId(), products.getOrDefault(request.getProductId(), 0) + request.getChange());
    
        // If quantity reaches 0, remove the product
        if (products.get(request.getProductId()) <= 0) {
            products.remove(request.getProductId());
        }
    
        // If no products remain under shopId, remove the shop
        if (products.isEmpty()) {
            shops.remove(request.getShopId());
        }
    
        // If no shop remains, don't delete, but leave an empty cart
        if (shops.isEmpty()) {
            return cartRepository.save(cart);  // Saving empty cart instead of deleting
        }
    
        return cartRepository.save(cart);  // Save updated cart with products and shops
    }
    
    // Updated to return Optional<Cart> directly from repository
    public Cart getCartByEmail(String email) {
        Optional<Cart> cartOptional = cartRepository.findByEmail(email);
        return cartOptional.orElse(null); // Return null if not found
    }

    public int getCartCountByEmail(String email) {
        Cart cart = getCartByEmail(email);
        if (cart == null || cart.getShops() == null) {
            return 0;  // No cart or no shops in cart
        }

        // Count the total quantity of products in all shops in the cart
        return cart.getShops().values().stream()
            .flatMap(shopProducts -> shopProducts.values().stream())
            .mapToInt(Integer::intValue)
            .sum();
    }

    public boolean deleteShopFromCart(String email, String shopId) {
        Optional<Cart> optionalCart = cartRepository.findByEmail(email);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            if (cart.getShops().containsKey(shopId)) {
                cart.getShops().remove(shopId);
                cartRepository.save(cart);
                return true;
            }
        }
        return false;
    }

}


