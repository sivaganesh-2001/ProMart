package com.example.promart.controller;

import com.example.promart.dto.MonthlyEarnings;
import com.example.promart.service.DashboardService;
import com.example.promart.service.EarningsService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend access
public class DashboardController {

    private final DashboardService dashboardService;
    private final EarningsService earningsService;
    
    public DashboardController(DashboardService dashboardService, EarningsService earningsService) {
        this.dashboardService = dashboardService;
        this.earningsService = earningsService;
    }
    

    @GetMapping("/earnings")
    public ResponseEntity<Map<String, Double>> getMonthlyEarnings(@RequestParam String sellerEmail) {
        double earnings = dashboardService.calculateMonthlyEarnings(sellerEmail);
        return ResponseEntity.ok(Map.of("amount", earnings));
    }

    @GetMapping("/billings")
    public ResponseEntity<Map<String, Integer>> getMonthlyBillings(@RequestParam String sellerEmail) {
        int billings = dashboardService.calculateMonthlyBillings(sellerEmail);
        return ResponseEntity.ok(Map.of("amount", billings));
    }

    @GetMapping("/online-orders")
    public ResponseEntity<Map<String, Integer>> getOnlineOrderPercentage(@RequestParam String sellerEmail) {
        int onlinePercentage = dashboardService.calculateOnlineOrderPercentage(sellerEmail);
        return ResponseEntity.ok(Map.of("percentage", onlinePercentage));
    }

    @GetMapping("/pending-orders")
    public ResponseEntity<Map<String, Integer>> getPendingOrders(@RequestParam String sellerId) {
        int pendingOrders = dashboardService.getPendingOrdersCount(sellerId);
        return ResponseEntity.ok(Map.of("count", pendingOrders));
    }

    @GetMapping("/yearly-earnings")
    public ResponseEntity<List<Map<String, Object>>> getYearlyEarnings(@RequestParam String sellerEmail) {
        List<MonthlyEarnings> earnings = earningsService.getYearlyEarnings(sellerEmail);
        List<Map<String, Object>> response = new ArrayList<>();

        for (MonthlyEarnings earning : earnings) {
            response.add(Map.of("month", earning.getMonth(), "amount", earning.getTotalEarnings()));
        }

        return ResponseEntity.ok(response);
    }

}

