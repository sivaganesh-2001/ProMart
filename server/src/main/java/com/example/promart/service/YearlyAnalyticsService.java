package com.example.promart.service;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class YearlyAnalyticsService {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public List<Map<String, Object>> getYearlySales(String sellerId, String type) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusYears(5).withDayOfYear(1); // Start of the first year in range
        LocalDateTime startOfYear = startDate.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);

        List<BillingOnline> onlineSales = new ArrayList<>();
        List<BillingOffline> offlineSales = new ArrayList<>();

        // Fetch sales for the past 5 years including the current year
        if (type == null || type.equals("online")) {
            onlineSales = billingOnlineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfYear, endOfToday);
        }
        if (type == null || type.equals("offline")) {
            offlineSales = billingOfflineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfYear, endOfToday);
        }

        // Prepare a map with 0 values for the past 5 years including the current year
        Map<String, Double> salesData = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy");
        
        for (int i = 0; i <= 5; i++) {
            String year = Year.from(startDate.plusYears(i)).format(formatter);
            salesData.put(year, 0.0);
        }

        // Aggregate sales per year
        for (BillingOnline sale : onlineSales) {
            String year = Year.from(sale.getBillGeneratedTime()).format(formatter);
            salesData.put(year, salesData.getOrDefault(year, 0.0) + sale.getTotalAmount());
        }

        for (BillingOffline sale : offlineSales) {
            String year = Year.from(sale.getBillGeneratedTime()).format(formatter);
            salesData.put(year, salesData.getOrDefault(year, 0.0) + sale.getTotalAmount());
        }

        // Convert map to list for response
        List<Map<String, Object>> yearlySales = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesData.entrySet()) {
            Map<String, Object> record = new HashMap<>();
            record.put("year", entry.getKey());
            record.put("totalAmount", entry.getValue());
            yearlySales.add(record);
        }

        return yearlySales;
    }
}
