package com.example.promart.repository;

import com.example.promart.model.ProductSalesData;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProductSalesRepository extends MongoRepository<ProductSalesData, String> {
    
    @Query("{ 'sellerId': ?0, 'monthYear': ?1, 'productId': ?2 }")
    Optional<ProductSalesData> findBySellerIdAndMonthYearAndProductId(String sellerId, String monthYear, String productId);

    @Query(value = "{}", fields = "{ 'sellerId' : 1 }")
    List<String> findDistinctSellerIds();

    List<ProductSalesData> findBySellerIdAndSaleDateBetween(String sellerId, LocalDateTime startDate, LocalDateTime endDate);
    void deleteBySaleDateBefore(LocalDateTime date);
}
