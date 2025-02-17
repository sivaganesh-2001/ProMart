package com.example.promart.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

import java.util.Map;

@Document(collection = "carts")  // Make sure the collection is specified
public class Cart {

    @Id
    private String email;  // Primary key
    private Map<String, Map<String, Integer>> shops;  // Map to store shopId -> productId -> quantity

    public Cart(String email, Map<String, Map<String, Integer>> shops) {
        this.email = email;
        this.shops = shops;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Map<String, Map<String, Integer>> getShops() {
        return shops;
    }

    public void setShops(Map<String, Map<String, Integer>> shops) {
        this.shops = shops;
    }
}
