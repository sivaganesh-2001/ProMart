package com.example.promart.model;

import java.time.LocalDateTime;

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
    private String masterId;
    private String masterProductId;
    private String imageUrl;
    private String sellerId;
    @DBRef
    private String sellerEmail;

    private LocalDateTime createdAt;
    private int soldCount;

    public int getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(int soldCount) {
        this.soldCount = soldCount;
    }

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

    public String getMasterId() {
        return masterId;
    }

    public void setMasterId(String masterId) {
        this.masterId = masterId;
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
    // return masterProductId;
    // }

    // public void setMasterProductId(String masterProductId) {
    // this.masterProductId = masterProductId;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Constructors
    public Product(String productName, String category, String brand, double price, int stock, String unit,
            String netQuantity, String imageUrl, String description, String topCategory, String productCategory) {
        this.productName = productName;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.netQuantity = netQuantity;
        // this.sellerId=sellerId;
        this.stock = stock;
        this.unit = unit;
        this.description = description;
        this.imageUrl = imageUrl;

        this.createdAt = LocalDateTime.now();

        this.topCategory = topCategory; // Set top category
        this.productCategory = productCategory; // Set product category

    }

    public Product(String id, String masterId, String productName) {
        this.id = id;
        this.masterId = masterId;
        this.productName = productName;
    }

    // Getters and Setters
    // (All necessary getters and setters for the fields)

    // Method to update stock and sales analytics
    public void reduceStock(int quantity, double sellingPrice) {
        if (quantity <= 0)
            throw new RuntimeException("Quantity must be greater than 0");
        if (this.stock >= quantity) {
            this.stock -= quantity;

            String today = LocalDateTime.now().toLocalDate().toString();

        } else {
            throw new RuntimeException("Insufficient stock for product: " + this.productName);
        }
    }

    public void reduceStock(int quantity) {
        if (quantity <= 0)
            throw new RuntimeException("Quantity must be greater than 0");
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

    public String getMasterProductId() {
        return masterProductId;
    }

    public void setMasterProductId(String masterProductId) {
        this.masterProductId = masterProductId;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public Product() {
    }
}