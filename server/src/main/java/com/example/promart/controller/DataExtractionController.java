package com.example.promart.controller;

import com.example.promart.model.CFTransaction;
import com.example.promart.service.DataExtractionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/cf-transactions")
public class DataExtractionController {

    private static final Logger logger = LoggerFactory.getLogger(DataExtractionController.class);

    @Autowired
    private DataExtractionService dataExtractionService;

    @PostMapping("/generate")
    public ResponseEntity<String> generateCFTransactions() {
        try {
            logger.info("Received request to generate CF transactions");
            dataExtractionService.extractAndSaveTransactions();
            logger.info("CF transactions generation completed successfully");
            return ResponseEntity.ok("CF transactions generated successfully");
        } catch (Exception e) {
            logger.error("Error generating CF transactions", e);
            return ResponseEntity.status(500).body("Failed to generate CF transactions: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<CFTransaction>> getAllCFTransactions() {
        try {
            logger.info("Received request to retrieve all CF transactions");
            List<CFTransaction> transactions = dataExtractionService.getAllTransactions();
            logger.info("Retrieved {} CF transactions", transactions.size());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            logger.error("Error retrieving CF transactions", e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}