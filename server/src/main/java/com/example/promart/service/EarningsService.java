package com.example.promart.service;

import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.dto.MonthlyEarnings;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class EarningsService {

    private final BillingOnlineRepository billingOnlineRepository;
    private final BillingOfflineRepository billingOfflineRepository;

    public EarningsService(BillingOnlineRepository billingOnlineRepository, BillingOfflineRepository billingOfflineRepository) {
        this.billingOnlineRepository = billingOnlineRepository;
        this.billingOfflineRepository = billingOfflineRepository;
    }

    public List<MonthlyEarnings> getYearlyEarnings(String sellerEmail) {
        int currentYear = LocalDateTime.now().getYear();
        LocalDateTime startOfYear = LocalDateTime.of(currentYear, 1, 1, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(currentYear + 1, 1, 1, 0, 0);
    
        List<MonthlyEarnings> onlineEarnings = billingOnlineRepository.getMonthlyEarnings(sellerEmail, startOfYear, endOfYear);
        List<MonthlyEarnings> offlineEarnings = billingOfflineRepository.getMonthlyEarnings(sellerEmail, startOfYear, endOfYear);
    
        // Initialize a map with all months (default 0)
        Map<Integer, Double> monthlyEarningsMap = new HashMap<>();
        for (int month = 1; month <= 12; month++) {
            monthlyEarningsMap.put(month, 0.0);
        }
    
        // Combine online and offline earnings
        for (MonthlyEarnings earnings : onlineEarnings) {
            monthlyEarningsMap.put(earnings.getMonth(), monthlyEarningsMap.get(earnings.getMonth()) + earnings.getTotalEarnings());
        }
        for (MonthlyEarnings earnings : offlineEarnings) {
            monthlyEarningsMap.put(earnings.getMonth(), monthlyEarningsMap.get(earnings.getMonth()) + earnings.getTotalEarnings());
        }
    
        // Convert map to list and return sorted
        return monthlyEarningsMap.entrySet().stream()
                .map(entry -> new MonthlyEarnings(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt(MonthlyEarnings::getMonth))
                .collect(Collectors.toList());
    }
}