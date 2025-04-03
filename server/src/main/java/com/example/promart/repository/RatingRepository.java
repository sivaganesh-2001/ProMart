package com.example.promart.repository;

import com.example.promart.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findBySellerId(String sellerId); // Fetch all ratings for a seller
}