package com.example.promart.repository;

import com.example.promart.model.MasterProduct;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface MasterProductRepository extends MongoRepository<MasterProduct, String> {
    Optional<MasterProduct> findById(String id); // Fetch master product by ID
}