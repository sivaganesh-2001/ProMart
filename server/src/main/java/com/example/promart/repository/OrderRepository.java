package com.example.promart.repository;

import com.example.promart.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // List<Order> findBySellerEmail(String sellerEmail);
    List<Order> findByCustomerEmail(String customerEmail);
    List<Order> findBySellerId(String sellerId);
}
