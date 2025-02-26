package com.example.promart.repository;

import com.example.promart.model.OrderHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderHistoryRepository extends MongoRepository<OrderHistory, String> {
    List<OrderHistory> findBySellerId(String sellerId);
    List<OrderHistory> findByCustomerEmail(String customerEmail);
    
    long countBySellerIdAndStatusAndCompletedDateAfter(String sellerId, String status, LocalDateTime completedDate);

}
