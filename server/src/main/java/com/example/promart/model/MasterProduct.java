package com.example.promart.model;

import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "master_products")
public class MasterProduct {

    @Id
    private String id; // Unique Master Product ID
    private List<String> productIds; // List of grouped Product IDs



    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<String> productIds) {
        this.productIds = productIds;
    }

    // Constructors
    public MasterProduct(String id, List<String> productIds) {
        this.id = id;
        this.productIds = productIds;
    }

    // Getters and Setters
}
