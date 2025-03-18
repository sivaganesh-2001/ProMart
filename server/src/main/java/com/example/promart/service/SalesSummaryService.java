package com.example.promart.service;

import com.example.promart.model.ProductSalesData;
import com.example.promart.model.SalesSummary;
import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;
import com.example.promart.repository.SalesSummaryRepository;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.BillingOfflineRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SalesSummaryService {

    @Autowired
    private SalesSummaryRepository salesSummaryRepository;

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    // Method to analyze sales data and update SalesSummary only when needed
    public void analyzeSalesData(String sellerId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastAllowedUpdate = now.minusHours(1); // Recalculate only if older than 6 hours

        // Fetch the existing summary document
        Optional<SalesSummary> existingSummaryOpt = salesSummaryRepository.findBySellerId(sellerId);
        SalesSummary existingSummary;

        // If the summary exists and is recent, return early
        if (existingSummaryOpt.isPresent()) {
            existingSummary = existingSummaryOpt.get();
            if (existingSummary.getLastUpdated().isAfter(lastAllowedUpdate)) {
                return; // Data is recent; no need to update
            }
        } else {
            // Create a new SalesSummary if it doesn't exist
            existingSummary = new SalesSummary(sellerId, now, new ArrayList<>(), new ArrayList<>());
        }

        LocalDateTime startDate = now.minusDays(30);

        // Fetch online and offline billing data for the last 30 days
        List<BillingOnline> onlineBills = billingOnlineRepository.findBySellerIdAndOrderDateAfter(sellerId, startDate);
        List<BillingOffline> offlineBills = billingOfflineRepository.findBySellerIdAndOrderDateAfter(sellerId, startDate);

        // Aggregate sales data
        Map<String, Integer> productSalesMap = new HashMap<>();

        // Process online bills
        onlineBills.forEach(bill -> bill.getItems().forEach(item ->
            productSalesMap.merge(item.getProductId(), item.getQuantity(), Integer::sum)
        ));

        // Process offline bills
        offlineBills.forEach(bill -> bill.getItems().forEach(item ->
            productSalesMap.merge(item.getProductId(), item.getQuantity(), Integer::sum)
        ));

        // Convert map to list and sort in descending order
        List<ProductSalesData> productSalesDataList = productSalesMap.entrySet().stream()
                .map(entry -> new ProductSalesData(entry.getKey(), entry.getValue()))
                .sorted((a, b) -> Integer.compare(b.getTotalSoldQuantity(), a.getTotalSoldQuantity())) // Descending order
                .collect(Collectors.toList());

        // Classify products into fast-moving and slow-moving
        List<ProductSalesData> topFastMoving = new ArrayList<>();
        List<ProductSalesData> topSlowMoving = new ArrayList<>();

        if (productSalesDataList.size() <= 5) {
            // If only 5 products exist, classify based on sales count
            for (ProductSalesData product : productSalesDataList) {
                if (product.getTotalSoldQuantity() > 1) {
                    topFastMoving.add(product);
                } else {
                    topSlowMoving.add(product);
                }
            }
        } else {
            // If more than 5 products exist, classify using top-selling and least-selling logic
            topFastMoving = productSalesDataList.stream().limit(5).collect(Collectors.toList());
            topSlowMoving = productSalesDataList.stream().skip(productSalesDataList.size() - 5).collect(Collectors.toList());
        }

        // Ensure no product appears in both lists
        Set<String> fastMovingIds = topFastMoving.stream().map(ProductSalesData::getProductId).collect(Collectors.toSet());
        topSlowMoving = topSlowMoving.stream()
                .filter(product -> !fastMovingIds.contains(product.getProductId()))
                .collect(Collectors.toList());

        // Update existing summary or create a new one
        existingSummary.setLastUpdated(now);
        existingSummary.setTopFastMoving(topFastMoving);
        existingSummary.setTopSlowMoving(topSlowMoving);

        // Save or update the sales summary
        salesSummaryRepository.save(existingSummary);
    }

    // Fetch fast-moving products
    public List<ProductSalesData> getFastMovingProducts(String sellerId) {
        return salesSummaryRepository.findBySellerId(sellerId)
                .map(SalesSummary::getTopFastMoving)
                .orElse(Collections.emptyList());
    }

    // Fetch slow-moving products
    public List<ProductSalesData> getSlowMovingProducts(String sellerId) {
        return salesSummaryRepository.findBySellerId(sellerId)
                .map(SalesSummary::getTopSlowMoving)
                .orElse(Collections.emptyList());
    }
}