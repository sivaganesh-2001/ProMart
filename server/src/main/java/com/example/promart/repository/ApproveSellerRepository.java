package com.example.promart.repository;

import com.example.promart.model.ApproveSeller;
import java.util.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ApproveSellerRepository extends MongoRepository<ApproveSeller, String> {
    Optional<ApproveSeller> findByEmail(String email);
}