package com.example.promart.model;

import java.time.LocalDate;

public class ProductSalesData {

    private String sellerId;
    private String monthYear;
    private String productId;
    private String productName;
    private int totalQuantitySold;
    private double totalRevenue;
    private LocalDate saleDate;
    
    // Constructors
    public ProductSalesData() {}

    public ProductSalesData(String sellerId, String monthYear, String productId, String productName, int totalQuantitySold, double totalRevenue, LocalDate saleDate) {
        this.sellerId = sellerId;
        this.monthYear = monthYear;
        this.productId = productId;
        this.productName = productName;
        this.totalQuantitySold = totalQuantitySold;
        this.totalRevenue = totalRevenue;
        this.saleDate = saleDate;
    }

    // Getters and Setters
    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(String monthYear) {
        this.monthYear = monthYear;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getTotalQuantitySold() {
        return totalQuantitySold;
    }

    public void setTotalQuantitySold(int totalQuantitySold) {
        this.totalQuantitySold = totalQuantitySold;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }
}
