package com.example.promart.service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.promart.model.ProductDetails;
import com.example.promart.model.ProductSalesData;
import com.example.promart.repository.ProductSalesRepository;

@Service
public class BillingService {

    private static final Logger logger = LoggerFactory.getLogger(BillingService.class);

    @Autowired
    private ProductSalesRepository productSalesRepository;

    @Autowired
    private SalesSummaryService salesSummaryService;

    @Transactional
    public void updateProductSales(String sellerId, List<ProductDetails> products) {

 
    //     if (products == null || products.isEmpty()) {
    //         logger.warn("No products to update for sellerId: {}", sellerId);
    //         return;
    //     }
    
    //     String monthYear = YearMonth.now().toString();
    //     LocalDate saleDate = LocalDate.now();
    
    //     for (ProductDetails product : products) {
    //         try {
    //             logger.info("Updating product sales for sellerId: {}, monthYear: {}, productId: {}", sellerId, monthYear, product.getProductId());
    //             productSalesRepository.findBySellerIdAndMonthYearAndProductId(sellerId, monthYear, product.getProductId())
    //                 .ifPresentOrElse(existingSales -> {
    //                     existingSales.setTotalQuantitySold(existingSales.getTotalQuantitySold() + product.getQuantity());
    //                     existingSales.setTotalRevenue(existingSales.getTotalRevenue() + (product.getPrice() * product.getQuantity()));
    //                     productSalesRepository.save(existingSales);
    //                 }, () -> {
    //                     ProductSalesData newSales = new ProductSalesData(
    //                         sellerId, monthYear, product.getProductId(),
    //                         product.getProductName(), product.getQuantity(),
    //                         product.getPrice() * product.getQuantity(), saleDate
    //                     );
    //                     productSalesRepository.save(newSales);
    //                 });
    //         } catch (Exception e) {
    //             logger.error("Failed to update product sales for productId: {} and sellerId: {}", product.getProductId(), sellerId, e);
    //             throw e;
    //         }
    //     }
    
    //     // Debugging log before calling updateSalesSummary
    //     logger.info("Calling updateSalesSummary for sellerId: {}", sellerId);
    
    //     // Update Sales Summary in real-time after adding sales data
    //     try {
    //         salesSummaryService.updateSalesSummary(sellerId);
    //         logger.info("Successfully updated sales summary for sellerId: {}", sellerId);
    //     } catch (Exception e) {
    //         logger.error("Failed to update sales summary for sellerId: {}", sellerId, e);
    //         throw e;
    //     }
    }
    
}
