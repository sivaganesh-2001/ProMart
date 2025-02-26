package com.example.promart.service;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DailyAnalyticsService {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public List<Map<String, Object>> getDailySales(String sellerId, String type) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(30);  // Past 30 days

        LocalDateTime startOfPeriod = startDate.atStartOfDay();
        LocalDateTime endOfPeriod = today.atTime(23, 59, 59);

        List<BillingOnline> onlineSales = new ArrayList<>();
        List<BillingOffline> offlineSales = new ArrayList<>();

        // Fetch sales for the past 30 days
        if (type == null || type.equals("online")) {
            onlineSales = billingOnlineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                    sellerId, startOfPeriod, endOfPeriod);
        }
        if (type == null || type.equals("offline")) {
            offlineSales = billingOfflineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                    sellerId, startOfPeriod, endOfPeriod);
        }

        // Initialize sales map with 0 for each day in the past month
        Map<String, Double> salesData = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 0; i < 30; i++) {
            String date = startDate.plusDays(i).format(formatter);
            salesData.put(date, 0.0);
        }

        // Aggregate online sales by date
        for (BillingOnline sale : onlineSales) {
            String date = sale.getBillGeneratedTime().toLocalDate().format(formatter);
            salesData.put(date, salesData.getOrDefault(date, 0.0) + sale.getTotalAmount());
        }

        // Aggregate offline sales by date
        for (BillingOffline sale : offlineSales) {
            String date = sale.getBillGeneratedTime().toLocalDate().format(formatter);
            salesData.put(date, salesData.getOrDefault(date, 0.0) + sale.getTotalAmount());
        }

        // Convert to list format
        List<Map<String, Object>> dailySales = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesData.entrySet()) {
            Map<String, Object> record = new HashMap<>();
            record.put("date", entry.getKey());
            record.put("totalAmount", entry.getValue());
            dailySales.add(record);
        }

        return dailySales;
    }
}
