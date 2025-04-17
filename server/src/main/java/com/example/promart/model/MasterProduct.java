package com.example.promart.model;

import com.example.promart.dto.Rating;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "master_products")
public class MasterProduct {

    @Id
    private String id; // Unique Master Product ID
    private List<String> productIds; // List of grouped Product IDs
    private List<Rating> ratings = new ArrayList<>(); // List to store ratings
    private double averageRating = 0.0; // Average rating
    private int totalRatings = 0; // Total number of ratings

    public MasterProduct() {
    }

    public MasterProduct(String id, List<String> productIds) {
        this.id = id;
        this.productIds = productIds;
    }

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

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    // Method to add or update a rating
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
        return "MasterProduct{" +
                "id='" + id + '\'' +
                ", productIds=" + productIds +
                ", ratings=" + ratings +
                ", averageRating=" + averageRating +
                ", totalRatings=" + totalRatings +
                '}';
    }
}