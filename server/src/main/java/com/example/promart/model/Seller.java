package com.example.promart.model;

import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "sellers")
public class Seller {

    @Id
    private String id;
    private String shopName;
    private String ownerName;
    
    @Indexed(unique = true)
    private String email;
    
    private String phone;
    private String address;
    
    @DBRef
    private List<Order> orders = new ArrayList<>();

    private List<String> categories;
    
    private String customCategory;
    private String password;
    private String shopImageUrl;

    @Field("location")
    @Indexed(name = "locationIndex")
    private Point location;



    @DBRef
    private List<Product> products = new ArrayList<>();

     // 🔹 Sales & Performance Analytics
     private double totalSales;             // Total revenue
     private int totalOrders;               // Total number of orders
     private double averageOrderValue;      // Avg. order value = totalSales / totalOrders
     private List<String> topSellingCategories; // Best performing categories
     private List<String> highDemandProducts;   // Most frequently searched or ordered items
     private double repeatCustomerRate;     // Percentage of returning customers
     private double salesGrowthRate;        // Sales increase percentage over time
     private double stockTurnoverRate;      // How quickly inventory sells out
     private double profitMargin;           // Profit percentage
     private double averageCartSize;        // Avg. number of products per order
     private int reviewsCount;              // Number of customer reviews
     private double averageRating;          // Star rating (1-5)
     private LocalDateTime lastOrderDate;   // Last order placed (for shop activity)
     private String reviewSentiments;       // "Positive", "Neutral", "Negative" (Based on sentiment analysis)
 

    public Seller() {}

    public Seller(String shopName, String ownerName, String email, String phone, String address, List<String> categories,
                 String customCategory, String password, String shopImageUrl, Point location) {
        this.shopName = shopName;
        this.ownerName = ownerName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.categories = categories;
        this.customCategory = customCategory;
        this.password = password;
        this.shopImageUrl = shopImageUrl;
        this.location = location;

        //Analytics
        this.totalSales = 0.0;
        this.totalOrders = 0;
        this.averageOrderValue = 0.0;
        this.topSellingCategories = new ArrayList<>();
        this.highDemandProducts = new ArrayList<>();
        this.repeatCustomerRate = 0.0;
        this.salesGrowthRate = 0.0;
        this.stockTurnoverRate = 0.0;
        this.profitMargin = 0.0;
        this.averageCartSize = 0.0;
        this.reviewsCount = 0;
        this.averageRating = 0.0;
        this.lastOrderDate = null;
        this.reviewSentiments = "Neutral";
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public void addProduct(Product product) {
        this.products.add(product);
    }

    public Point getLocation() {
        return location;
    }

    public void setLocation(Point location) {
        this.location = location;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        if (categories.size() > 5) {
            throw new IllegalArgumentException("Maximum 5 categories allowed");
        }
        this.categories = categories;
    }
    

    public void addCategory(String category) {
        if (this.categories.size() < 5) {
            this.categories.add(category);
        }
    }

    public void removeCategory(String category) {
        this.categories.remove(category);
    }

    public String getCustomCategory() {
        return customCategory;
    }

    public void setCustomCategory(String customCategory) {
        this.customCategory = customCategory;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getShopImageUrl() {
        return shopImageUrl;
    }

    public void setShopImageUrl(String shopImageUrl) {
        this.shopImageUrl = shopImageUrl;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void addOrder(Order order) {
        if (this.orders == null) {
            this.orders = new ArrayList<>();
        }
        this.orders.add(order);
    }

    @Override
    public String toString() {
        return "Seller{" +
                "id='" + id + '\'' +
                ", shopName='" + shopName + '\'' +
                ", ownerName='" + ownerName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", categories=" + categories +
                ", customCategory='" + customCategory + '\'' +
                ", password='" + password + '\'' +
                ", shopImageUrl='" + shopImageUrl + '\'' +
                ", location=" + location +
                ", products=" + products +
                ", orders=" + orders +
                '}';
    }

    public double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(double totalSales) {
        this.totalSales = totalSales;
    }

    public int getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(int totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(double averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public List<String> getTopSellingCategories() {
        return topSellingCategories;
    }

    public void setTopSellingCategories(List<String> topSellingCategories) {
        this.topSellingCategories = topSellingCategories;
    }

    public List<String> getHighDemandProducts() {
        return highDemandProducts;
    }

    public void setHighDemandProducts(List<String> highDemandProducts) {
        this.highDemandProducts = highDemandProducts;
    }

    public double getRepeatCustomerRate() {
        return repeatCustomerRate;
    }

    public void setRepeatCustomerRate(double repeatCustomerRate) {
        this.repeatCustomerRate = repeatCustomerRate;
    }

    public double getSalesGrowthRate() {
        return salesGrowthRate;
    }

    public void setSalesGrowthRate(double salesGrowthRate) {
        this.salesGrowthRate = salesGrowthRate;
    }

    public double getStockTurnoverRate() {
        return stockTurnoverRate;
    }

    public void setStockTurnoverRate(double stockTurnoverRate) {
        this.stockTurnoverRate = stockTurnoverRate;
    }

    public double getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(double profitMargin) {
        this.profitMargin = profitMargin;
    }

    public double getAverageCartSize() {
        return averageCartSize;
    }

    public void setAverageCartSize(double averageCartSize) {
        this.averageCartSize = averageCartSize;
    }

    public int getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(int reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public LocalDateTime getLastOrderDate() {
        return lastOrderDate;
    }

    public void setLastOrderDate(LocalDateTime lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }

    public String getReviewSentiments() {
        return reviewSentiments;
    }

    public void setReviewSentiments(String reviewSentiments) {
        this.reviewSentiments = reviewSentiments;
    }

}