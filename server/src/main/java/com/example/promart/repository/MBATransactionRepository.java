package com.example.promart.repository;

import com.example.promart.model.MBATransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MBATransactionRepository extends MongoRepository<MBATransaction, String> {
}