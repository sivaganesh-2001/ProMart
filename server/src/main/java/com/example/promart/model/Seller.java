package com.example.promart.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.example.promart.dto.Rating;
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
    private String shopImageUrl;
    @Field("location")
    @Indexed(name = "locationIndex")
    private Point location;

    @DBRef
    private List<Product> products = new ArrayList<>();
    // private Map<String, Double> ratings = new HashMap<>(); // userId -> rating (1
    // to 5)

    private List<Rating> ratings = new ArrayList<>();

    private double averageRating = 0.0;
    private int totalRatings = 0;

    public Seller() {
    }

    public Seller(String shopName, String ownerName, String email, String phone, String address,
            List<String> categories,
            String shopImageUrl, Point location) {
        this.shopName = shopName;
        this.ownerName = ownerName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.categories = categories;
        this.shopImageUrl = shopImageUrl;
        this.location = location;

    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
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

    // public Map<String, Double> getRatings() {
    // return ratings;
    // }

    // public void setRatings(Map<String, Double> ratings) {
    // this.ratings = ratings;
    // }

    // Getters & Setters
    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public void addOrder(Order order) {
        if (this.orders == null) {
            this.orders = new ArrayList<>();
        }
        this.orders.add(order);
    }

    public void updateRating(String userId, double newRating) {
        if (newRating < 1 || newRating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Rating existing = null;
        for (Rating r : ratings) {
            if (r.getUserId().equals(userId)) {
                existing = r;
                break;
            }
        }

        if (existing == null) {
            // New rating
            Rating rating = new Rating(userId, newRating);
            ratings.add(rating);
            totalRatings++;
            averageRating = ((averageRating * (totalRatings - 1)) + newRating) / totalRatings;
        } else {
            // Update existing rating
            double oldRating = existing.getRating();
            existing.setRating(newRating);
            averageRating = ((averageRating * totalRatings) - oldRating + newRating) / totalRatings;
        }
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
                ", shopImageUrl='" + shopImageUrl + '\'' +
                ", location=" + location +
                ", products=" + products +
                ", orders=" + orders +
                ", averageRating=" + averageRating +
                '}';
    }

}