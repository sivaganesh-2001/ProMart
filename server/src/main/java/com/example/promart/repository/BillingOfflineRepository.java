package com.example.promart.repository;


import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;

public interface BillingOfflineRepository extends MongoRepository<BillingOffline, String> {

    List<BillingOffline> findBySellerId(String sellerId);
    List<BillingOffline> findBySellerIdAndBillGeneratedTimeBetween(String sellerId, LocalDateTime start, LocalDateTime end);
    List<BillingOffline> findBySellerIdAndOrderDateAfter(String sellerId, LocalDateTime orderDate);

}
