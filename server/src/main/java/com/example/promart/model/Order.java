package com.example.promart.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;
    private String customerEmail;
    @Indexed
    private String sellerId;
    private List<ProductDetails> items;
    private double totalAmount;
    private String paymentMethod;
    private String address;
    private String phone;
    @Indexed
    private String status; // pending, confirmed, cancelled
    @Indexed
    private LocalDateTime orderDate; // This should be a normal field
    private LocalDateTime statusUpdatedAt;
    private LocalDateTime processingTime;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

    // Analytics Fields
    private double discountApplied; // Total discount on the order
    private double taxAmount; // Tax added to the totalAmount
    private double profitMargin; // Revenue analysis field
    private Duration orderProcessingTime; // Time from order placement to confirmation
    private String customerType; // New or Returning customer

    public Order() {}

    public Order(String customerEmail, String sellerId, List<ProductDetails> items, double totalAmount,
                 String paymentMethod, String address, String phone, String status) {
        this.customerEmail = customerEmail;
        this.sellerId = sellerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.address = address;
        this.phone = phone;
        this.status = status;
        this.orderDate = LocalDateTime.now(); // Set the orderDate to the current date and time
        this.statusUpdatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    // ... (rest of the getters and setters remain unchanged)

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public List<ProductDetails> getItems() {
        return items;
    }

    public void setItems(List<ProductDetails> items) {
        this.items = items;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStatusUpdatedAt() {
        return statusUpdatedAt;
    }

    public void setStatusUpdatedAt(LocalDateTime statusUpdatedAt) {
        this.statusUpdatedAt = statusUpdatedAt;
    }

    public LocalDateTime getProcessingTime() {
        return processingTime;
    }

    public void setProcessingTime(LocalDateTime processingTime) {
        this.processingTime = processingTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public double getDiscountApplied() {
        return discountApplied;
    }

    public void setDiscountApplied(double discountApplied) {
        this.discountApplied = discountApplied;
    }

    public double getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public double getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(double profitMargin) {
        this.profitMargin = profitMargin;
    }

    public Duration getOrderProcessingTime() {
        return orderProcessingTime;
    }

    public void setOrderProcessingTime(Duration orderProcessingTime) {
        this.orderProcessingTime = orderProcessingTime;
    }

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }
}