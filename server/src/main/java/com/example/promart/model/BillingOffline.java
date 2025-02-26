    package com.example.promart.model;

    import java.time.LocalDateTime;
    import java.util.List;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.mongodb.core.mapping.Document;

    @Document(collection = "billings_offline")
    public class BillingOffline {
        @Id
        private String id;  
        private String customerEmail;
        private String sellerId;
        private List<ProductDetails> items;
        private double totalAmount;
        private String phone;
        private LocalDateTime orderDate;
        private LocalDateTime billGeneratedTime;

        // Analytics Fields
        private String paymentMethod;  // Cash, Card, UPI, etc.
        private double discountApplied;
        private double taxAmount;
        private double profitMargin;
        private String mostSoldCategory;
        private boolean repeatCustomer;
        private String salesChannel; // Walk-in, Phone Order, App

    public BillingOffline() {
    }

    public BillingOffline(String customerEmail, String sellerId, List<ProductDetails> items, double totalAmount,
            String phone, LocalDateTime orderDate, LocalDateTime billGeneratedTime, String paymentMethod,
            double discountApplied, double taxAmount, double profitMargin, String mostSoldCategory,
            boolean repeatCustomer, String salesChannel) {
        this.customerEmail = customerEmail;
        this.sellerId = sellerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.phone = phone;
        this.orderDate = orderDate;
        this.billGeneratedTime = billGeneratedTime;
        this.paymentMethod = paymentMethod;
        this.discountApplied = discountApplied;
        this.taxAmount = taxAmount;
        this.profitMargin = profitMargin;
        this.mostSoldCategory = mostSoldCategory;
        this.repeatCustomer = repeatCustomer;
        this.salesChannel = salesChannel;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    // Analytics Getters and Setters

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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

    public String getMostSoldCategory() {
        return mostSoldCategory;
    }

    public void setMostSoldCategory(String mostSoldCategory) {
        this.mostSoldCategory = mostSoldCategory;
    }

    public boolean isRepeatCustomer() {
        return repeatCustomer;
    }

    public void setRepeatCustomer(boolean repeatCustomer) {
        this.repeatCustomer = repeatCustomer;
    }

    public String getSalesChannel() {
        return salesChannel;
    }

    public void setSalesChannel(String salesChannel) {
        this.salesChannel = salesChannel;
    }
}
