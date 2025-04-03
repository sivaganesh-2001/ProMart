package com.example.promart.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String productName;
    private String category;
    private String brand;
    private double price;
    private int stock;
    private String unit;
    private String description;
    private String netQuantity;
    // New fields for top category and product category
    private String topCategory; // ID of the top category
    private String productCategory; // ID of the product category


    private String imageUrl;
    private String sellerId;
   // private String masterProductId;  // New Field to Link Master Product



    @DBRef
    private String sellerEmail;
    private int soldCount;
    // New Fields for Analytics
    private LocalDateTime createdAt;
    private LocalDateTime lastSoldAt;
    private double totalRevenue;
    private double averageSellingPrice;
    private double customerRetentionRate;
    private Map<String, Integer> dailySales;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getNetQuantity() {
        return netQuantity;
    }

    public void setNetQuantity(String netQuantity) {
        this.netQuantity = netQuantity;
    }

    // public String getMasterProductId() {
    //     return masterProductId;
    // }

    // public void setMasterProductId(String masterProductId) {
    //     this.masterProductId = masterProductId;
    // }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(int soldCount) {
        this.soldCount = soldCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastSoldAt() {
        return lastSoldAt;
    }

    public void setLastSoldAt(LocalDateTime lastSoldAt) {
        this.lastSoldAt = lastSoldAt;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getAverageSellingPrice() {
        return averageSellingPrice;
    }

    public void setAverageSellingPrice(double averageSellingPrice) {
        this.averageSellingPrice = averageSellingPrice;
    }

    public double getCustomerRetentionRate() {
        return customerRetentionRate;
    }

    public void setCustomerRetentionRate(double customerRetentionRate) {
        this.customerRetentionRate = customerRetentionRate;
    }

    public Map<String, Integer> getDailySales() {
        return dailySales;
    }

    public void setDailySales(Map<String, Integer> dailySales) {
        this.dailySales = dailySales;
    }

    // Constructors
    public Product(String productName, String category, String brand, double price, int stock, String unit,
            String netQuantity, String imageUrl, String description, String topCategory, String productCategory) {
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.netQuantity=netQuantity;
        //this.sellerId=sellerId;
        this.stock = stock;
        this.unit = unit;
        this.description = description;
        this.imageUrl = imageUrl;
        this.soldCount = 0;
        this.createdAt = LocalDateTime.now();
        this.totalRevenue = 0;
        this.averageSellingPrice = price;
        this.customerRetentionRate = 0;
        this.topCategory = topCategory; // Set top category
        this.productCategory = productCategory; // Set product category
    
        this.dailySales = new HashMap<>();
    }

    // Getters and Setters
    // (All necessary getters and setters for the fields)

    // Method to update stock and sales analytics
    public void reduceStock(int quantity, double sellingPrice) {
        if (quantity <= 0) throw new RuntimeException("Quantity must be greater than 0");
        if (this.stock >= quantity) {
            this.stock -= quantity;
            this.soldCount += quantity;
            this.totalRevenue += quantity * sellingPrice;
            this.lastSoldAt = LocalDateTime.now();
            // Update daily sales record
            String today = LocalDateTime.now().toLocalDate().toString();
            this.dailySales.put(today, this.dailySales.getOrDefault(today, 0) + quantity);
            
            // Update average selling price dynamically
            this.averageSellingPrice = this.totalRevenue / this.soldCount;
        } else {
            throw new RuntimeException("Insufficient stock for product: " + this.productName);
        }
    }
    
    public void reduceStock(int quantity) {
        if (quantity <= 0) throw new RuntimeException("Quantity must be greater than 0");
        if (this.stock >= quantity) {
            this.stock -= quantity;
        }
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerEmail() {
        return sellerEmail;
    }

    public void setSellerEmail(String sellerEmail) {
        this.sellerEmail = sellerEmail;
    }
}