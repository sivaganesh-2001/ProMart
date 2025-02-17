package com.example.promart.service;

import com.example.promart.model.BillingOnline;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.mongodb.core.query.Criteria;

@Service
public class BillingOnlineService {

    @Autowired
    private MongoTemplate mongoTemplate;

    // public List<Map<String, Object>> getDailySales(String sellerId) {
    //     Aggregation aggregation = Aggregation.newAggregation(
    //             Aggregation.match(Criteria.where("sellerId").is(sellerId)),
    //             Aggregation.project()
    //                     .andExpression("year(orderDate)").as("year")
    //                     .andExpression("month(orderDate)").as("month")
    //                     .andExpression("dayOfMonth(orderDate)").as("dayOfMonth"),
    //             Aggregation.group("year", "month", "dayOfMonth")
    //                     .sum("totalAmount").as("totalSales")
    //                     .count().as("totalOrders"),
    //             Aggregation.sort(Sort.by("_id").ascending()));
    //     return mongoTemplate.aggregate(aggregation, "billings_online", Map.class).getMappedResults();
    // }

    // public List<Map<String, Object>> getWeeklySales(String sellerId) {
    //     Aggregation aggregation = Aggregation.newAggregation(
    //             Aggregation.match(Criteria.where("sellerId").is(sellerId)),
    //             Aggregation.project()
    //                     .andExpression("year(orderDate)").as("year")
    //                     .andExpression("week(orderDate)").as("week"),
    //             Aggregation.group("year", "week")
    //                     .sum("totalAmount").as("totalSales")
    //                     .count().as("totalOrders"),
    //             Aggregation.sort(Sort.by("_id").ascending()));
    //     return mongoTemplate.aggregate(aggregation, "billings_online", Map.class).getMappedResults();
    // }

    // public List<Map<String, Object>> getMonthlySales(String sellerId) {
    //     Aggregation aggregation = Aggregation.newAggregation(
    //             Aggregation.match(Criteria.where("sellerId").is(sellerId)),
    //             Aggregation.project()
    //                     .andExpression("year(orderDate)").as("year")
    //                     .andExpression("month(orderDate)").as("month"),
    //             Aggregation.group("year", "month")
    //                     .sum("totalAmount").as("totalSales")
    //                     .count().as("totalOrders"),
    //             Aggregation.sort(Sort.by("_id").ascending()));
    //     return mongoTemplate.aggregate(aggregation, "billings_online", Map.class).getMappedResults();
    // }
}
