package com.example.promart.service;

import com.example.promart.repository.OrderHistoryRepository;
import com.example.promart.repository.OrderRepository;
import com.example.promart.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderAnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;

    public OrderAnalyticsService(OrderRepository orderRepository, OrderHistoryRepository orderHistoryRepository) {
        this.orderRepository = orderRepository;
        this.orderHistoryRepository = orderHistoryRepository;
    }

    public Map<String, Long> getOrderStatusCountForLastWeek(String sellerId) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        
        // Log the parameters
        System.out.println("Seller ID: " + sellerId);
        System.out.println("One Week Ago: " + oneWeekAgo);
    
        // Fetch counts for Pending and Confirmed orders
        long pendingCount = orderRepository.countBySellerIdAndStatusAndOrderDateAfter(sellerId, "Pending", oneWeekAgo);
        long confirmedCount = orderRepository.countBySellerIdAndStatusAndOrderDateAfter(sellerId, "Confirmed", oneWeekAgo);
        
        // Fetch counts for Delivered and Cancelled orders using the same date range
        long deliveredCount = orderHistoryRepository.countBySellerIdAndStatusAndCompletedDateAfter(sellerId, "Delivered", oneWeekAgo);
        long cancelledCount = orderHistoryRepository.countBySellerIdAndStatusAndCompletedDateAfter(sellerId, "Cancelled", oneWeekAgo);
        
        // Log the counts
        System.out.println("Pending Count: " + pendingCount);
        System.out.println("Confirmed Count: " + confirmedCount);
        System.out.println("Delivered Count: " + deliveredCount);
        System.out.println("Cancelled Count: " + cancelledCount);
        
        // Prepare the result map
        Map<String, Long> statusCount = new HashMap<>();
        statusCount.put("pending", pendingCount);
        statusCount.put("confirmed", confirmedCount);
        statusCount.put("delivered", deliveredCount);
        statusCount.put("cancelled", cancelledCount);
        
        return statusCount;
    }
}