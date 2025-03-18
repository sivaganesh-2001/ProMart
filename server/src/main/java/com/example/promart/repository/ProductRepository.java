package com.example.promart.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.promart.model.Product;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findBySellerId(String sellerId); // Fetch products by seller

    // Fetch products by name containing the search term (case-insensitive)

    @Query("{ 'productName': { $regex: ?0, $options: 'i' } }")
    List<Product> findByNameContaining(String productName);

    // Fetch top 5 popular products based on sold count
    List<Product> findTop5ByOrderBySoldCountDesc();
    List<Product> findByIdIn(List<String> ids);

    // List<Product> findBySellerIdAndNameContainingIgnoreCase(String sellerId,
    // String productName);

    // Custom method to decrement stock
    @Query(value = "{ '_id': ?0 }")
    void decrementStockById(String id, int amount);

List<Product> findByProductNameIgnoreCaseContaining(String productName);
    

}
