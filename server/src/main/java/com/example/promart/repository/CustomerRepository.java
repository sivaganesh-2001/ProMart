package com.example.promart.repository;

import com.example.promart.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {
    Optional<Customer> findByCustomerEmail(String customerEmail); // Query by email
    boolean existsByCustomerEmail(String email);
    List<Customer> findAll();
}   
