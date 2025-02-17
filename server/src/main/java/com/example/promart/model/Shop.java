package com.example.promart.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shops")
public class Shop {
    @Id
    private String id;
    private String name;
    private String imageUrl;
    private List<Product> products;

    // Constructor
    public Shop(String id, String name, String imageUrl, List<Product> products) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.products = products;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<Product> getProducts() { return products; }
    public void setProducts(List<Product> products) { this.products = products; }
}
