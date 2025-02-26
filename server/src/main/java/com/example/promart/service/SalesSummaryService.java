package com.example.promart.service;

import com.example.promart.model.ProductSalesData;
import com.example.promart.model.ProductDetails;
import com.example.promart.model.SalesSummary;
import com.example.promart.repository.ProductSalesRepository;
import com.example.promart.repository.SalesSummaryRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class SalesSummaryService {

    private static final Logger logger = LoggerFactory.getLogger(SalesSummaryService.class);

    @Autowired
    private SalesSummaryRepository salesSummaryRepository;

    @Autowired
    private ProductSalesRepository productSalesRepository;



    public void updateSalesSummary(String sellerId) {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(30);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = today.atTime(23, 59, 59);

        logger.info("Fetching sales data for sellerId: {} from {} to {}", sellerId, startDate, today);

        // Fetch all sales data for the seller in the date range
        List<ProductSalesData> salesData = productSalesRepository
                .findBySellerIdAndSaleDateBetween(sellerId, startDateTime, endDateTime);

        // Calculate cumulative totals for each product
        List<ProductSalesData> cumulativeSalesData = salesData.stream()
                .collect(Collectors.groupingBy(ProductSalesData::getProductId))
                .values().stream()
                .map(products -> {
                    ProductSalesData firstProduct = products.get(0);
                    int totalQuantity = products.stream().mapToInt(ProductSalesData::getTotalQuantitySold).sum();
                    double totalRevenue = products.stream().mapToDouble(ProductSalesData::getTotalRevenue).sum();
                    return new ProductSalesData(
                            firstProduct.getSellerId(),
                            firstProduct.getMonthYear(),
                            firstProduct.getProductId(),
                            firstProduct.getProductName(),
                            totalQuantity,
                            totalRevenue,
                            firstProduct.getSaleDate() // Assuming you want to keep the sale date from the first product
                    );
                })
                .collect(Collectors.toList());

        // Determine top 10 best-selling products
        List<ProductSalesData> topBestSelling = cumulativeSalesData.stream()
                .sorted((p1, p2) -> Integer.compare(p2.getTotalQuantitySold(), p1.getTotalQuantitySold()))
                .limit(10)
                .collect(Collectors.toList());

        // Determine top 10 least-selling products
        List<ProductSalesData> topLeastSelling = cumulativeSalesData.stream()
                .sorted((p1, p2) -> Integer.compare(p1.getTotalQuantitySold(), p2.getTotalQuantitySold()))
                .limit(10)
                .collect(Collectors.toList());

        // Filter out products that are in both lists
        List<ProductSalesData> filteredLeastSelling = topLeastSelling.stream()
                .filter(p -> !topBestSelling.contains(p))
                .collect(Collectors.toList());

        // Fetch existing summary or create a new one
        SalesSummary summary = salesSummaryRepository.findBySellerIdAndSaleDate(sellerId, today)
                .orElse(new SalesSummary(sellerId, today, topBestSelling, filteredLeastSelling));

        logger.info("Updating sales summary for sellerId: {} - Best Selling: {}, Least Selling: {}",
                sellerId, topBestSelling.size(), filteredLeastSelling.size());

        summary.setTopBestSelling(topBestSelling);
        summary.setTopLeastSelling(filteredLeastSelling);
        salesSummaryRepository.save(summary);

        logger.info("Sales summary updated successfully for sellerId: {}", sellerId);
    }

    // Deletes sales data older than 30 days every day at 2:00 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void deleteOldSalesData() {
        try {
            LocalDateTime thresholdDate = LocalDate.now().minusDays(30).atStartOfDay();
            productSalesRepository.deleteBySaleDateBefore(thresholdDate);
            logger.info("Deleted old sales data older than {}", thresholdDate);
        } catch (Exception e) {
            logger.error("Failed to delete old sales data", e);
        }
    }

    public List<ProductSalesData> getFastMovingProducts(String sellerId) {
        return salesSummaryRepository.findBySellerId(sellerId)
                .stream()
                .flatMap(salesSummary -> salesSummary.getTopBestSelling().stream())
                .sorted((p1, p2) -> Integer.compare(p2.getTotalQuantitySold(), p1.getTotalQuantitySold())) // Sort Descending
                .limit(5) // Top 5
                .collect(Collectors.toList());
    }

    // Fetch Slow Moving Products (Bottom 5 lowest selling)
    public List<ProductSalesData> getSlowMovingProducts(String sellerId) {
        return salesSummaryRepository.findBySellerId(sellerId)
                .stream()
                .flatMap(salesSummary -> salesSummary.getTopLeastSelling().stream())
                .sorted((p1, p2) -> Integer.compare(p1.getTotalQuantitySold(), p2.getTotalQuantitySold())) // Sort Ascending
                .limit(5) // Bottom 5
                .collect(Collectors.toList());
    }

}