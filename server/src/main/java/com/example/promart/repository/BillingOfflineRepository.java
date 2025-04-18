package com.example.promart.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.promart.dto.MonthlyEarnings;
import com.example.promart.model.BillingOffline;

public interface BillingOfflineRepository extends MongoRepository<BillingOffline, String> {

        List<BillingOffline> findBySellerId(String sellerId);

        List<BillingOffline> findBySellerIdAndBillGeneratedTimeBetween(String sellerId, LocalDateTime start,
                        LocalDateTime end);

        List<BillingOffline> findBySellerIdAndOrderDateAfter(String sellerId, LocalDateTime orderDate);

        @Query(value = "{ 'sellerId': ?0, 'billGeneratedTime': { $gte: ?1, $lte: ?2 } }", fields = "{ 'totalAmount': 1 }")
        List<BillingOffline> findEarningsBySellerAndMonth(String sellerId, LocalDateTime startDate,
                        LocalDateTime endDate);

        @Query(value = "{ 'sellerId': ?0, 'billGeneratedTime': { $gte: ?1, $lte: ?2 } }", count = true)
        int countBySellerAndMonth(String sellerId, LocalDateTime startDate, LocalDateTime endDate);

        @Aggregation(pipeline = {
                        "{ $match: { sellerId: ?0, billGeneratedTime: { $gte: ?1, $lte: ?2 } } }",
                        "{ $group: { _id: { month: { $month: '$billGeneratedTime' } }, totalEarnings: { $sum: '$totalAmount' } } }",
                        "{ $sort: { '_id.month': 1 } }",
                        "{ $project: { month: '$_id.month', totalEarnings: 1, _id: 0 } }"
        })
        List<MonthlyEarnings> getMonthlyEarnings(String sellerId, LocalDateTime startDate, LocalDateTime endDate);

}