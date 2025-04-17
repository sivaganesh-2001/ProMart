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
        private String paymentMethod;
        private String address;
        private String phone;
        @Indexed
        private String status; // delivered, cancelled
        private LocalDateTime completedDate;
        private LocalDateTime orderDate;

    // @CreatedDate
    // @Indexed
    // private LocalDateTime createdAt;

    // private Duration orderProcessingTime;
    // private String cancellationReason;

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
