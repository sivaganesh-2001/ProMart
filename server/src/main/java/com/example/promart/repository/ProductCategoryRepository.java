package com.example.promart.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.promart.model.ProductCategory;

public interface ProductCategoryRepository extends MongoRepository<ProductCategory, String> {
    List<ProductCategory> findByTopCategory(String topCategory);
}
