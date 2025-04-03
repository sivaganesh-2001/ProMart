package com.example.promart.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.razorpay.Payment;

@Repository
public interface PaymentRepository extends MongoRepository<Payment, String> {
}
