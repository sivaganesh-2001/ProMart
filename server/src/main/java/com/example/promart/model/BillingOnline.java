package com.example.promart.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "billings_online")
public class BillingOnline {

    @Id
    private String id;
    private String customerEmail;
    private String sellerId;
    private List<ProductDetails> items;
    private double totalAmount;
    private double discountApplied;
    private double taxAmount;
    private double profitMargin;
    private int totalQuantity;
    private String paymentMethod;
    private String address;
    private String phone;
    private String status;
    private String customerType; // "new" or "returning"

    private LocalDateTime orderDate;
    @Indexed
    private LocalDateTime billGeneratedTime;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

    private Duration orderProcessingTime;
    private boolean isRepeatCustomer;
    private double paymentSuccessRate;
    private String customerFeedback;

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

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
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

    public Duration getOrderProcessingTime() {
        return orderProcessingTime;
    }

    public void setOrderProcessingTime(Duration orderProcessingTime) {
        this.orderProcessingTime = orderProcessingTime;
    }

    public boolean isRepeatCustomer() {
        return isRepeatCustomer;
    }

    public void setRepeatCustomer(boolean isRepeatCustomer) {
        this.isRepeatCustomer = isRepeatCustomer;
    }

    public double getPaymentSuccessRate() {
        return paymentSuccessRate;
    }

    public void setPaymentSuccessRate(double paymentSuccessRate) {
        this.paymentSuccessRate = paymentSuccessRate;
    }

    public String getCustomerFeedback() {
        return customerFeedback;
    }

    public void setCustomerFeedback(String customerFeedback) {
        this.customerFeedback = customerFeedback;
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
        this.discountApplied = discountApplied;
        this.taxAmount = taxAmount;
        this.profitMargin = profitMargin;
        this.totalQuantity = totalQuantity;
        this.paymentMethod = paymentMethod;
        this.address = address;
        this.phone = phone;
        this.status = status;
        this.customerType = customerType;
        this.orderDate = orderDate;
        this.billGeneratedTime = billGeneratedTime;
        this.createdAt = LocalDateTime.now();
        this.isRepeatCustomer = "returning".equalsIgnoreCase(customerType);
        this.paymentSuccessRate = 100.0;
        this.customerFeedback = "";

        if (orderDate != null && billGeneratedTime != null) {
            this.orderProcessingTime = Duration.between(orderDate, billGeneratedTime);
        } else {
            this.orderProcessingTime = Duration.ZERO;
        }
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
                ", discountApplied=" + discountApplied +
                ", taxAmount=" + taxAmount +
                ", orderProcessingTime=" + orderProcessingTime +
                ", isRepeatCustomer=" + isRepeatCustomer +
                ", paymentSuccessRate=" + paymentSuccessRate +
                ", customerFeedback='" + customerFeedback + '\'' +
                '}';
    }
}
