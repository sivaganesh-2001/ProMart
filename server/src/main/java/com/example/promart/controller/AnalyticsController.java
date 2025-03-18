package com.example.promart.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.promart.dto.SalesComparisonResponse;
import com.example.promart.model.ProductSalesData;
import com.example.promart.service.DailyAnalyticsService;
import com.example.promart.service.HourlyAnalyticsService;
import com.example.promart.service.MonthlyAnalyticsService;
import com.example.promart.service.OrderAnalyticsService;
import com.example.promart.service.SalesComparisonService;
import com.example.promart.service.SalesSummaryService;
import com.example.promart.service.WeeklyAnalyticsService;
import com.example.promart.service.YearlyAnalyticsService;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private HourlyAnalyticsService hourlyAnalyticsService;

    @Autowired
    private DailyAnalyticsService dailyAnalyticsService;

    @Autowired
    private WeeklyAnalyticsService weeklyAnalyticsService;

    @Autowired
    private MonthlyAnalyticsService monthlyAnalyticsService;
 
    @Autowired
    private YearlyAnalyticsService yearlyAnalyticsService;
    @Autowired
    private SalesSummaryService salesSummaryService;

    @Autowired
    private OrderAnalyticsService orderAnalyticsService;

    @Autowired
    private SalesComparisonService salesComparisonService;



    @GetMapping("/hourly")
    public List<Map<String, Object>> geHourlySales(@RequestParam String sellerId, @RequestParam(required = false) String type) {
        return hourlyAnalyticsService.getHourlySales(sellerId, type);
    }

    @GetMapping("/daily")
    public List<Map<String, Object>> getDailySales(
            @RequestParam String sellerId,
            @RequestParam(required = false) String type) {
        return dailyAnalyticsService.getDailySales(sellerId, type);
    }

    @GetMapping("/weekly")
    public List<Map<String, Object>> getWeeklySales(@RequestParam String sellerId, @RequestParam(required = false) String type) {
        return weeklyAnalyticsService.getWeeklySales(sellerId, type);
    }



    @GetMapping("/monthly")
    public List<Map<String, Object>> getMonthlySales(@RequestParam String sellerId, @RequestParam(required = false) String type) {
    return monthlyAnalyticsService.getMonthlySales(sellerId, type);
}

    @GetMapping("/yearly")
    public List<Map<String, Object>> getYearlySales(@RequestParam String sellerId, @RequestParam(required = false) String type) {
    return yearlyAnalyticsService.getYearlySales(sellerId, type);
    }


    @GetMapping("/slow-moving")
    public List<ProductSalesData> getSlowMovingProducts(@RequestParam String sellerId) {
        salesSummaryService.analyzeSalesData(sellerId); // Trigger analysis
        return salesSummaryService.getSlowMovingProducts(sellerId);
    }
    
    @GetMapping("/fast-moving")
    public List<ProductSalesData> getFastMovingProducts(@RequestParam String sellerId) {
        salesSummaryService.analyzeSalesData(sellerId); // Trigger analysis
        return salesSummaryService.getFastMovingProducts(sellerId);
    }

    
    @GetMapping("/status-count")
    public Map<String, Long> getOrderStatusCount(@RequestParam String sellerId) {
        return orderAnalyticsService.getOrderStatusCountForLastWeek(sellerId);
    }


    @GetMapping("/compare-online-offline")
    public List<SalesComparisonResponse> compareSales(
            @RequestParam String sellerId,
            @RequestParam String timeFrame,
            @RequestParam String metric) {
        return salesComparisonService.compareSales(sellerId, timeFrame, metric);
    }

 
    

}

