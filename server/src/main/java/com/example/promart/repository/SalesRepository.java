package com.example.promart.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.time.LocalDateTime;
import com.example.promart.model.Sales;

public interface SalesRepository extends MongoRepository<Sales, String> {
    List<Sales> findBySellerIdAndTimestampBetween(String sellerId, LocalDateTime start, LocalDateTime end);
}
