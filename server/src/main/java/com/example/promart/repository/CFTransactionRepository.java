package com.example.promart.repository;

import com.example.promart.model.CFTransaction;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CFTransactionRepository extends MongoRepository<CFTransaction, String> {

    Optional<CFTransaction> findByCustomerEmailAndMasterId(String customerEmail, String masterId);

}
