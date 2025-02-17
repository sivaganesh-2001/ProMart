package com.example.promart.repository;

import com.example.promart.model.OrderHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderHistoryRepository extends MongoRepository<OrderHistory, String> {
    List<OrderHistory> findBySellerId(String sellerId);
    List<OrderHistory> findByCustomerEmail(String customerEmail);
}
