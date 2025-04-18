package com.example.promart.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ratings")
public class Rating {

    @Id
    private String id;
    private String sellerId; // References the Seller
    private String customerEmail;
    private int rating; // 1 to 5
    private String review; // Customer comment
    private LocalDateTime timestamp;

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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    // Default constructor
    public Rating() {}

    // Parameterized constructor
    public Rating(String sellerId, String customerEmail, int rating, String review, LocalDateTime timestamp) {
        this.sellerId = sellerId;
        this.customerEmail = customerEmail;
        this.rating = rating;
        this.review = review;
        this.timestamp = timestamp;
    }


    @Override
    public String toString() {
        return "Rating{" +
                "id='" + id + '\'' +
                ", sellerId='" + sellerId + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", rating=" + rating +
                ", review='" + review + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}