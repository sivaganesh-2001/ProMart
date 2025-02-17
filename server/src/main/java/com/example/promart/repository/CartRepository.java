package com.example.promart.repository;

import com.example.promart.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByEmail(String email);  // Use Optional<Cart> to handle absent carts
}
