package com.example.promart.controller;

import com.example.promart.dto.CartUpdateRequest;
import com.example.promart.model.Cart;
import com.example.promart.service.CartService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/update")
    public ResponseEntity<?> updateCart(@RequestBody CartUpdateRequest request) {
        // Pass productName to the service
        Cart updatedCart = cartService.updateCart(request);
        if (updatedCart == null) {
            return ResponseEntity.ok("Cart is now empty and deleted.");
        }
        return ResponseEntity.ok(updatedCart);
    }

    
    
    @GetMapping("/count")
    public ResponseEntity<Integer> getCartCount(@RequestParam String userId) {
        int cartCount = cartService.getCartCountByEmail(userId);
        return ResponseEntity.ok(cartCount);  // Return cart item count
    }
    @GetMapping("/{email}")
    public ResponseEntity<Cart> getCart(@PathVariable String email) {
        return ResponseEntity.ok(cartService.getCartByEmail(email));
    }

    @DeleteMapping("/delete-shop")
    public ResponseEntity<Map<String, String>> deleteShop(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String shopId = request.get("shopId");

        boolean deleted = cartService.deleteShopFromCart(email, shopId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "Shop deleted from cart successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Shop not found in cart"));
        }
    }

}
