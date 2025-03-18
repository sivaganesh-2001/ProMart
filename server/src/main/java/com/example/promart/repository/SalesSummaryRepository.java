package com.example.promart.repository;

import com.example.promart.model.SalesSummary;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDate;

public interface SalesSummaryRepository extends MongoRepository<SalesSummary, String> {
    
    // Optional<SalesSummary> findBySellerIdAndSaleDate(String sellerId, LocalDate saleDate);
     Optional<SalesSummary> findBySellerId(String sellerId);
    SalesSummary findTopBySellerIdOrderByLastUpdatedDesc(String sellerId);
    
    //SalesSummary findBySellerId(String sellerId);
}
