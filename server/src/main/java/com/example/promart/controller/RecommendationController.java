package com.example.promart.controller;

import com.example.promart.model.MasterProduct;
import com.example.promart.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    public ResponseEntity<List<MasterProduct>> getRecommendations(@RequestParam String email) {
        try {
            List<MasterProduct> recommendations = recommendationService.getRecommendations(email);
            return ResponseEntity.ok(recommendations);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}