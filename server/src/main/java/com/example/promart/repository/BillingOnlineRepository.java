package com.example.promart.repository;

import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface BillingOnlineRepository extends MongoRepository<BillingOnline, String> {
    @Query("{'sellerId': ?0}")
    List<BillingOnline> findBySellerId(String sellerId);
    List<BillingOnline> findBySellerIdAndOrderDateAfter(String sellerId, LocalDateTime orderDate);
    List<BillingOnline> findBySellerIdAndBillGeneratedTimeBetween(String sellerId, LocalDateTime start, LocalDateTime end);
}
