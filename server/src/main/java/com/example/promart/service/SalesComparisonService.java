package com.example.promart.service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.promart.dto.SalesComparisonResponse;
import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;
import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;

@Service
public class SalesComparisonService {

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    public List<SalesComparisonResponse> compareSales(String sellerId, String timeFrame, String metric) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startDate = getStartDate(timeFrame, now);

        List<BillingOffline> offlineSales = billingOfflineRepository.findBySellerIdAndOrderDateAfter(sellerId, startDate);
        List<BillingOnline> onlineSales = billingOnlineRepository.findBySellerIdAndOrderDateAfter(sellerId, startDate);

        Map<String, SalesComparisonResponse> salesMap = new TreeMap<>();

        // Process offline sales
        for (BillingOffline offline : offlineSales) {
            String label = formatLabel(timeFrame, offline.getOrderDate());
            double value = metric.equals("orderCount") ? 1 : offline.getTotalAmount();

            salesMap.putIfAbsent(label, new SalesComparisonResponse(label, 0, 0));
            SalesComparisonResponse response = salesMap.get(label);
            response.setOfflineSales(response.getOfflineSales() + value);
        }

        // Process online sales
        for (BillingOnline online : onlineSales) {
            String label = formatLabel(timeFrame, online.getOrderDate());
            double value = metric.equals("orderCount") ? 1 : online.getTotalAmount();

            salesMap.putIfAbsent(label, new SalesComparisonResponse(label, 0, 0));
            SalesComparisonResponse response = salesMap.get(label);
            response.setOnlineSales(response.getOnlineSales() + value);
        }

        // Convert map to list and make cumulative
        List<SalesComparisonResponse> cumulativeSalesList = new ArrayList<>();
        double cumulativeOnline = 0;
        double cumulativeOffline = 0;

        for (SalesComparisonResponse response : salesMap.values()) {
            cumulativeOnline += response.getOnlineSales();
            cumulativeOffline += response.getOfflineSales();
            cumulativeSalesList.add(new SalesComparisonResponse(response.getLabel(), cumulativeOnline, cumulativeOffline));
        }

        return cumulativeSalesList;
    }

    private LocalDateTime getStartDate(String timeFrame, LocalDateTime now) {
        switch (timeFrame) {
            case "day":
                return now.truncatedTo(ChronoUnit.DAYS);
            case "week":
                return now.minusWeeks(1);
            case "month":
                return now.minusMonths(1);
            case "year":
                return now.minusYears(1);
            default:
                throw new IllegalArgumentException("Invalid time frame: " + timeFrame);
        }
    }

    private String formatLabel(String timeFrame, LocalDateTime date) {
        switch (timeFrame) {
            case "day":
                return date.getHour() + ":00";
            case "week":
                return "Day " + date.getDayOfWeek().toString().substring(0, 3);
            case "month":
                return "Day " + date.getDayOfMonth();
            case "year":
                return "Month " + date.getMonth().toString().substring(0, 3);
            default:
                return date.toString();
        }
    }
}
