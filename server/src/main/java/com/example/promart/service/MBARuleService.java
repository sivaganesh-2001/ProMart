package com.example.promart.service;

import com.example.promart.model.MBARule;
import com.example.promart.repository.MBARuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MBARuleService {

    @Autowired
    private MBARuleRepository mbaRuleRepository;

    public List<MBARule> getRecommendations(String productId) {
        return mbaRuleRepository.findByAntecedentsContaining(productId);
    }
}
