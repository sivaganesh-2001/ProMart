package com.example.promart.service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;
import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;

@Service
public class MonthlyAnalyticsService {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public List<Map<String, Object>> getMonthlySales(String sellerId, String type) {
        LocalDateTime startOfYear = LocalDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(LocalDateTime.now().getYear(), 12, 31, 23, 59);

        List<BillingOnline> onlineSales = new ArrayList<>();
        List<BillingOffline> offlineSales = new ArrayList<>();

        if (type == null || type.equals("online")) {
            onlineSales = billingOnlineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfYear, endOfYear);
        }
        if (type == null || type.equals("offline")) {
            offlineSales = billingOfflineRepository.findBySellerIdAndBillGeneratedTimeBetween(
                sellerId, startOfYear, endOfYear);
        }

        // Store monthly sales data
        List<Map<String, Object>> monthlySalesData = new ArrayList<>();

        for (Month month : Month.values()) {
            String monthName = month.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            double monthSales = 0.0;

            // Calculate monthly sales
            for (BillingOnline sale : onlineSales) {
                if (sale.getBillGeneratedTime().getMonth() == month) {
                    monthSales += sale.getTotalAmount();
                }
            }
            for (BillingOffline sale : offlineSales) {
                if (sale.getBillGeneratedTime().getMonth() == month) {
                    monthSales += sale.getTotalAmount();
                }
            }

            // Create a record for the month
            Map<String, Object> record = new HashMap<>();
            record.put("month", monthName);
            record.put("totalAmount", monthSales);
            monthlySalesData.add(record);
        }

        return monthlySalesData;
    }
}