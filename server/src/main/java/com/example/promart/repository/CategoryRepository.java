package com.example.promart.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.promart.model.Category;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {

}
