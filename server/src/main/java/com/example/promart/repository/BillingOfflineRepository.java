package com.example.promart.repository;


import com.example.promart.model.BillingOffline;
import com.example.promart.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BillingOfflineRepository extends MongoRepository<BillingOffline, String> {

    List<BillingOffline> findBySellerId(String sellerId);

}
