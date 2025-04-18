package com.example.promart.service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;
import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.OrderRepository;

@Service
public class DashboardService {

    private final BillingOnlineRepository billingOnlineRepository;
    private final BillingOfflineRepository billingOfflineRepository;
    private final OrderRepository orderRepository;

    public DashboardService(BillingOnlineRepository billingOnlineRepository,
            BillingOfflineRepository billingOfflineRepository, OrderRepository orderRepository) {
        this.billingOnlineRepository = billingOnlineRepository;
        this.billingOfflineRepository = billingOfflineRepository;
        this.orderRepository = orderRepository;

    }

    // Get start and end of the current month
    private LocalDateTime getStartOfMonth() {
        return LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0).withSecond(0);
    }

    private LocalDateTime getEndOfMonth() {
        return LocalDateTime.now().with(TemporalAdjusters.lastDayOfMonth()).withHour(23).withMinute(59).withSecond(59);
    }

    // 1️⃣ Calculate Monthly Earnings
    public double calculateMonthlyEarnings(String sellerEmail) {
        List<BillingOnline> onlineEarningsList = billingOnlineRepository.findEarningsBySellerAndMonth(sellerEmail,
                getStartOfMonth(), getEndOfMonth());
        List<BillingOffline> offlineEarningsList = billingOfflineRepository.findEarningsBySellerAndMonth(sellerEmail,
                getStartOfMonth(), getEndOfMonth());

        double onlineEarnings = onlineEarningsList.stream().mapToDouble(BillingOnline::getTotalAmount).sum();
        double offlineEarnings = offlineEarningsList.stream().mapToDouble(BillingOffline::getTotalAmount).sum();

        return onlineEarnings + offlineEarnings;
    }

    // 2️⃣ Calculate Monthly Billings Count
    public int calculateMonthlyBillings(String sellerEmail) {
        int onlineBillings = billingOnlineRepository.countBySellerAndMonth(sellerEmail, getStartOfMonth(),
                getEndOfMonth());
        int offlineBillings = billingOfflineRepository.countBySellerAndMonth(sellerEmail, getStartOfMonth(),
                getEndOfMonth());
        return onlineBillings + offlineBillings;
    }

    // 3️⃣ Calculate Online Orders Percentage
    public int calculateOnlineOrderPercentage(String sellerEmail) {
        int onlineOrders = billingOnlineRepository.countBySellerAndMonth(sellerEmail, getStartOfMonth(),
                getEndOfMonth());
        int offlineOrders = billingOfflineRepository.countBySellerAndMonth(sellerEmail, getStartOfMonth(),
                getEndOfMonth());

        int totalOrders = onlineOrders + offlineOrders;
        if (totalOrders == 0)
            return 0; // Avoid division by zero
        return (onlineOrders * 100) / totalOrders;
    }

    public int getPendingOrdersCount(String sellerId) {
        LocalDateTime startOfMonth = getStartOfMonth();
        LocalDateTime endOfMonth = getEndOfMonth();
        return orderRepository.countPendingOrdersInMonth(sellerId, startOfMonth, endOfMonth);
    }
}
