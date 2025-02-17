package com.example.promart.repository;

import com.example.promart.model.BillingOnline;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface BillingOnlineRepository extends MongoRepository<BillingOnline, String> {
    @Query("{'sellerId': ?0}")
    List<BillingOnline> findBySellerId(String sellerId);
}
