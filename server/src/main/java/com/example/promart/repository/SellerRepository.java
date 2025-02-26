package com.example.promart.repository;

import com.example.promart.model.Product;
import com.example.promart.model.Seller;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerRepository extends MongoRepository<Seller, String> {
    Logger logger = LoggerFactory.getLogger(SellerRepository.class);

    Optional<Seller> findByEmail(String email);
  
    Optional<Seller> findById(String id);

    @Query("{ location: { $near: { $geometry: { type: 'Point', coordinates: [ ?0, ?1 ] }, $maxDistance: ?2 } } }")
    List<Seller> findByLocationNear(double latitude, double longitude, double maxDistance);
    // List<Product> findBySellerIdAndProductNameRegex(String id, String regex);
}
