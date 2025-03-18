package com.example.promart.model;

import java.time.LocalDateTime;

public class ProductSalesData {
    private String productId;
    private int totalSoldQuantity;
    private String sellerId; // Ensure this exists
    private LocalDateTime saleDate;

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    // Constructors
    public ProductSalesData() {}

    public ProductSalesData(String productId, int totalSoldQuantity) {
        this.productId = productId;
        this.totalSoldQuantity = totalSoldQuantity;
    }

    // Getters and Setters
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public int getTotalSoldQuantity() { return totalSoldQuantity; }
    public void setTotalSoldQuantity(int totalSoldQuantity) { this.totalSoldQuantity = totalSoldQuantity; }
}
