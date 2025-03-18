package com.example.promart.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
@NoArgsConstructor
public class Category {
    @Id
    private String id;
    private String name;
    private int productCount; // Helps in analytics
    private double popularityScore; // For ML-based recommendations

    public Category(String id, String name, int productCount, double popularityScore) {
        this.id = id;
        this.name = name;
        this.productCount = productCount;
        this.popularityScore = popularityScore;
    }
        
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public int getProductCount() {
        return productCount;
    }
    public void setProductCount(int productCount) {
        this.productCount = productCount;
    }
    public double getPopularityScore() {
        return popularityScore;
    }
    public void setPopularityScore(double popularityScore) {
        this.popularityScore = popularityScore;
    }
}
