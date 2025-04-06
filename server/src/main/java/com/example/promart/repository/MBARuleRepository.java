package com.example.promart.repository;

import com.example.promart.model.MBARule;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MBARuleRepository extends MongoRepository<MBARule, String> {
    List<MBARule> findByAntecedentsContaining(String productId);
}
