package com.example.promart.service;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WeeklyAnalyticsService {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public List<Map<String, Object>> getWeeklySales(String sellerId, String type) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(6); // Get past 7 days including today
        LocalDateTime startOfWeek = startDate.atStartOfDay();  
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX); 

        List<BillingOnline> onlineSales = new ArrayList<>();
        List<BillingOffline> offlineSales = new ArrayList<>();

        // Fetch sales for the last 7 days
        if (type == null || type.equals("online")) {
            onlineSales = billingOnlineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfWeek, endOfToday);
        }
        if (type == null || type.equals("offline")) {
            offlineSales = billingOfflineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfWeek, endOfToday);
        }

        // Prepare a map with 0 values for the past 7 days
        Map<String, Double> salesData = new TreeMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = 0; i < 7; i++) {
            String date = startDate.plusDays(i).format(formatter);
            salesData.put(date, 0.0);
        }

        // Aggregate sales per day
        for (BillingOnline sale : onlineSales) {
            String date = sale.getBillGeneratedTime().format(formatter);
            salesData.put(date, salesData.getOrDefault(date, 0.0) + sale.getTotalAmount());
        }

        for (BillingOffline sale : offlineSales) {
            String date = sale.getBillGeneratedTime().format(formatter);
            salesData.put(date, salesData.getOrDefault(date, 0.0) + sale.getTotalAmount());
        }

        // Convert map to list for response
        List<Map<String, Object>> weeklySales = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesData.entrySet()) {
            Map<String, Object> record = new HashMap<>();
            record.put("date", entry.getKey());
            record.put("totalAmount", entry.getValue());
            weeklySales.add(record);
        }

        return weeklySales;
    }
}
