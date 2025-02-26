package com.example.promart.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

    import java.time.Duration;
    import java.time.LocalDateTime;
    import java.util.List;

    @Document(collection = "order_history")
    public class OrderHistory {

        @Id
        private String id;
        private String customerEmail;
        @Indexed
        private String sellerId;
        private List<ProductDetails> items;
        private double totalAmount;
        private double profitMargin;
        private double discountApplied;
        private double taxAmount;
        private String paymentMethod;
        private String address;
        private String phone;
        @Indexed
        private String status; // delivered, cancelled
        private String customerType; // new, returning
       
        private LocalDateTime completedDate;

    private LocalDateTime orderDate;
    private LocalDateTime statusUpdatedAt;
    private LocalDateTime processingTime;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

    private Duration orderProcessingTime;
    private String cancellationReason;

    public OrderHistory() {}

    public OrderHistory(Order order, String status, String cancellationReason) {
        this.id = order.getId();
        this.customerEmail = order.getCustomerEmail();
        this.sellerId = order.getSellerId();
        this.items = order.getItems();
        this.totalAmount = order.getTotalAmount();
        this.paymentMethod = order.getPaymentMethod();
        this.address = order.getAddress();
        this.phone = order.getPhone();
        this.status = status;
        this.orderDate = order.getOrderDate();
        this.statusUpdatedAt = LocalDateTime.now();
        this.cancellationReason = cancellationReason;
        this.discountApplied = order.getDiscountApplied();
        this.taxAmount = order.getTaxAmount();
        this.profitMargin = order.getProfitMargin();
        this.customerType = order.getCustomerType();
        this.createdAt = LocalDateTime.now();

        if (order.getProcessingTime() != null) {
            this.processingTime = order.getProcessingTime();
            this.orderProcessingTime = Duration.between(order.getOrderDate(), order.getProcessingTime());
        }
    }

    // Getters and Setters

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

    public LocalDateTime getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDateTime completedDate) {
        this.completedDate = completedDate;
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

    public double getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(double profitMargin) {
        this.profitMargin = profitMargin;
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

    public String getCustomerType() {
        return customerType;
    }

    public void setCustomerType(String customerType) {
        this.customerType = customerType;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
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

    public Duration getOrderProcessingTime() {
        return orderProcessingTime;
    }

    public void setOrderProcessingTime(Duration orderProcessingTime) {
        this.orderProcessingTime = orderProcessingTime;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public OrderHistory(Order order) {
        this.id = order.getId();
        this.customerEmail = order.getCustomerEmail();
        this.sellerId = order.getSellerId();
        this.items = order.getItems();
        this.totalAmount = order.getTotalAmount();
        this.paymentMethod = order.getPaymentMethod();
        this.address = order.getAddress();
        this.phone = order.getPhone();
        this.status = order.getStatus();
        this.orderDate = order.getOrderDate();
        this.completedDate = LocalDateTime.now();
    }
}
