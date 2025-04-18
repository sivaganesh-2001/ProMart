package com.example.promart.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.promart.model.BillingOffline;
import com.example.promart.model.BillingOnline;
import com.example.promart.model.ProductDetails;
import com.example.promart.model.ProductSalesData;
import com.example.promart.model.SalesSummary;
import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;
import com.example.promart.repository.SalesSummaryRepository;

@Service
public class SalesSummaryService {

    private static final Logger logger = LoggerFactory.getLogger(SalesSummaryService.class);

    @Autowired
    private SalesSummaryRepository salesSummaryRepository;

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    public void analyzeSalesData(String sellerId) {
        logger.info("Starting sales data analysis for sellerId: {}", sellerId);
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime lastAllowedUpdate = now.minusHours(1);

            Optional<SalesSummary> existingSummaryOpt = salesSummaryRepository.findBySellerId(sellerId);
            SalesSummary summary;

            if (existingSummaryOpt.isPresent()) {
                summary = existingSummaryOpt.get();
                if (summary.getLastUpdated() != null && summary.getLastUpdated().isAfter(lastAllowedUpdate)) {
                    logger.info("Sales summary for sellerId {} is recent, skipping update", sellerId);
                    return;
                }
            } else {
                summary = new SalesSummary();
                summary.setSellerId(sellerId);
                summary.setTopFastMoving(new ArrayList<>());
                summary.setTopSlowMoving(new ArrayList<>());
            }

            LocalDateTime startDate = now.minusDays(30);

            // Fetch billing data
            List<BillingOnline> onlineBills = billingOnlineRepository.findBySellerIdAndOrderDateAfter(sellerId,
                    startDate);
            List<BillingOffline> offlineBills = billingOfflineRepository.findBySellerIdAndOrderDateAfter(sellerId,
                    startDate);
            logger.info("Fetched {} online bills and {} offline bills for sellerId {}",
                    onlineBills.size(), offlineBills.size(), sellerId);

            // Aggregate sales data
            Map<String, Integer> productSalesMap = new HashMap<>();

            // Process online bills
            for (BillingOnline bill : onlineBills) {
                List<ProductDetails> items = bill.getItems();
                if (items != null) {
                    for (ProductDetails item : items) {
                        if (item != null && item.getProductId() != null) {
                            productSalesMap.merge(item.getProductId(), item.getQuantity(), Integer::sum);
                        } else {
                            logger.warn("Skipping null item or missing productId in online bill: {}", bill.getId());
                        }
                    }
                } else {
                    logger.warn("Online bill {} has null items for sellerId {}", bill.getId(), sellerId);
                }
            }

            // Process offline bills
            for (BillingOffline bill : offlineBills) {
                List<ProductDetails> items = bill.getItems();
                if (items != null) {
                    for (ProductDetails item : items) {
                        if (item != null && item.getProductId() != null) {
                            productSalesMap.merge(item.getProductId(), item.getQuantity(), Integer::sum);
                        } else {
                            logger.warn("Skipping null item or missing productId in offline bill: {}", bill.getId());
                        }
                    }
                } else {
                    logger.warn("Offline bill {} has null items for sellerId {}", bill.getId(), sellerId);
                }
            }

            logger.info("Aggregated sales for {} products", productSalesMap.size());

            // Convert map to list and sort
            List<ProductSalesData> productSalesDataList = productSalesMap.entrySet().stream()
                    .map(entry -> {
                        ProductSalesData data = new ProductSalesData(entry.getKey(), entry.getValue());
                        data.setSellerId(sellerId);
                        return data;
                    })
                    .sorted((a, b) -> Integer.compare(b.getTotalSoldQuantity(), a.getTotalSoldQuantity()))
                    .collect(Collectors.toList());

            // Classify products
            List<ProductSalesData> topFastMoving = new ArrayList<>();
            List<ProductSalesData> topSlowMoving = new ArrayList<>();

            if (productSalesDataList.size() <= 5) {
                for (ProductSalesData product : productSalesDataList) {
                    if (product.getTotalSoldQuantity() > 1) {
                        topFastMoving.add(product);
                    } else {
                        topSlowMoving.add(product);
                    }
                }
            } else {
                topFastMoving = productSalesDataList.stream().limit(5).collect(Collectors.toList());
                topSlowMoving = productSalesDataList.stream()
                        .skip(Math.max(0, productSalesDataList.size() - 5))
                        .collect(Collectors.toList());
            }

            // Ensure no duplicates
            Set<String> fastMovingIds = topFastMoving.stream()
                    .map(ProductSalesData::getProductId)
                    .collect(Collectors.toSet());
            topSlowMoving = topSlowMoving.stream()
                    .filter(product -> !fastMovingIds.contains(product.getProductId()))
                    .collect(Collectors.toList());

            logger.info("Classified {} fast-moving and {} slow-moving products",
                    topFastMoving.size(), topSlowMoving.size());

            // Update summary
            summary.setLastUpdated(now);
            summary.setTopFastMoving(topFastMoving);
            summary.setTopSlowMoving(topSlowMoving);

            salesSummaryRepository.save(summary);
            logger.info("Saved sales summary for sellerId {}", sellerId);
        } catch (Exception e) {
            logger.error("Failed to analyze sales data for sellerId {}: {}", sellerId, e.getMessage(), e);
            throw new RuntimeException("Failed to analyze sales data", e);
        }
    }

    public List<ProductSalesData> getFastMovingProducts(String sellerId) {
        try {
            List<ProductSalesData> result = salesSummaryRepository.findBySellerId(sellerId)
                    .map(SalesSummary::getTopFastMoving)
                    .orElse(Collections.emptyList());
            logger.info("Retrieved {} fast-moving products for sellerId {}", result.size(), sellerId);
            return result;
        } catch (Exception e) {
            logger.error("Error retrieving fast-moving products for sellerId {}: {}", sellerId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public List<ProductSalesData> getSlowMovingProducts(String sellerId) {
        try {
            List<ProductSalesData> result = salesSummaryRepository.findBySellerId(sellerId)
                    .map(SalesSummary::getTopSlowMoving)
                    .orElse(Collections.emptyList());
            logger.info("Retrieved {} slow-moving products for sellerId {}", result.size(), sellerId);
            return result;
        } catch (Exception e) {
            logger.error("Error retrieving slow-moving products for sellerId {}: {}", sellerId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }
}