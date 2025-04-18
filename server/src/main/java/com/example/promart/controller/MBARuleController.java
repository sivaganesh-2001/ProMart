package com.example.promart.controller; 

import com.example.promart.model.MBARule;
import com.example.promart.service.MBARuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin("*") // Allow requests from frontend
public class MBARuleController {

    @Autowired
    private MBARuleService mbaRuleService;

    @GetMapping("/{productId}")
    public List<MBARule> getRecommendations(@PathVariable String productId) {
        return mbaRuleService.getRecommendations(productId);
    }
}
