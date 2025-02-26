package com.example.promart.service;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HourlyAnalyticsService {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public List<Map<String, Object>> getHourlySales(String sellerId, String type) {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN); // Today at 00:00:00
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX); // Today at 23:59:59

        List<BillingOnline> onlineSales = new ArrayList<>();
        List<BillingOffline> offlineSales = new ArrayList<>();

        // Fetch data based on type
        if (type == null || type.equals("online")) {
            onlineSales = billingOnlineRepository.findBySellerIdAndBillGeneratedTimeBetween(sellerId, startOfDay, endOfDay);
        }
        if (type == null || type.equals("offline")) {
            offlineSales = billingOfflineRepository.findBySellerIdAndBillGeneratedTimeBetween(sellerId, startOfDay, endOfDay);
        }

        // Combine data for total sales if no specific type is requested
        List<Map<String, Object>> hourlySales = new ArrayList<>();

        // Process data for both online & offline sales
        Map<String, Double> salesData = new TreeMap<>();

        for (BillingOnline sale : onlineSales) {
            String hour = sale.getBillGeneratedTime().format(DateTimeFormatter.ofPattern("HH:00"));
            salesData.put(hour, salesData.getOrDefault(hour, 0.0) + sale.getTotalAmount());
        }

        for (BillingOffline sale : offlineSales) {
            String hour = sale.getBillGeneratedTime().format(DateTimeFormatter.ofPattern("HH:00"));
            salesData.put(hour, salesData.getOrDefault(hour, 0.0) + sale.getTotalAmount());
        }

        // Convert map to list
        for (Map.Entry<String, Double> entry : salesData.entrySet()) {
            Map<String, Object> record = new HashMap<>();
            record.put("hour", entry.getKey());
            record.put("totalAmount", entry.getValue());
            hourlySales.add(record);
        }

        return hourlySales;
    }
}
