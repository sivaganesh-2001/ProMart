package com.example.promart.controller;

import com.example.promart.model.Seller;
import com.example.promart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class ShopController {

    @Autowired
    private SellerRepository sellerRepository;  // Use SellerRepository instead

    @GetMapping("/{shopId}")
    public ResponseEntity<Seller> getShopById(@PathVariable String shopId) {
        Optional<Seller> seller = sellerRepository.findById(shopId);  // Query SellerRepository
        return seller.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
