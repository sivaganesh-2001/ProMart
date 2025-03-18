package com.example.promart.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.promart.model.Order;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    // List<Order> findBySellerEmail(String sellerEmail);
    List<Order> findByCustomerEmail(String customerEmail);
    List<Order> findBySellerId(String sellerId);
    
    long countBySellerIdAndStatusAndOrderDateAfter(String sellerId, String status, LocalDateTime orderDate);

    @Query(value = "{ 'sellerId': ?0, 'status': 'Pending', 'orderDate': { $gte: ?1, $lte: ?2 } }", count = true)
    int countPendingOrdersInMonth(String sellerId, LocalDateTime startDate, LocalDateTime endDate);
    
}
