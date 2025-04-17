package com.example.promart.dto;

import java.time.LocalDateTime;

public class Rating {
    private String userId;
    private double rating;
    // private String review;
   // private LocalDateTime timestamp;

   public Rating() {} // Required by Spring Data for deserialization

   public Rating(String userId, double rating) {
       this.userId = userId;
       this.rating = rating;
   }

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    // public String getReview() { return review; }
    // public void setReview(String review) { this.review = review; }

    // public LocalDateTime getTimestamp() { return timestamp; }
    // public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}