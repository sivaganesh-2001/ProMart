package com.example.promart.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "billings_online")
public class BillingOnline {

    @Id
    private String id;
    private String customerEmail;
    private String sellerId;
    private List<ProductDetails> items;
    private double totalAmount;
    private String paymentMethod;
    private String address;
    private String phone;
    private String status;
    // private String customerType; // "new" or "returning"

    private LocalDateTime orderDate;
    @Indexed
    private LocalDateTime billGeneratedTime;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

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

    // public String getCustomerType() {
    // return customerType;
    // }

    // public void setCustomerType(String customerType) {
    // this.customerType = customerType;
    // }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getBillGeneratedTime() {
        return billGeneratedTime;
    }

    public void setBillGeneratedTime(LocalDateTime billGeneratedTime) {
        this.billGeneratedTime = billGeneratedTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BillingOnline() {
    }

    public BillingOnline(String customerEmail, String sellerId, List<ProductDetails> items, double totalAmount,
            double discountApplied, double taxAmount, double profitMargin, int totalQuantity,
            String paymentMethod, String address, String phone, String status,
            String customerType, LocalDateTime orderDate, LocalDateTime billGeneratedTime) {
        this.customerEmail = customerEmail;
        this.sellerId = sellerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.address = address;
        this.phone = phone;
        this.status = status;
        // this.customerType = customerType;
        this.orderDate = orderDate;
        this.billGeneratedTime = billGeneratedTime;
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "BillingOnline{" +
                "id='" + id + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", sellerId='" + sellerId + '\'' +
                ", items=" + items +
                ", totalAmount=" + totalAmount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", address='" + address + '\'' +
                ", phone='" + phone + '\'' +
                ", status='" + status + '\'' +
                ", orderDate=" + orderDate +
                ", billGeneratedTime=" + billGeneratedTime +

                '}';
    }
}
