package com.example.promart.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "approveSeller")
public class ApproveSeller {

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

    public ApproveSeller() {}

    public ApproveSeller(String shopName, String ownerName, String email, String phone, String address, List<String> categories,
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
}
