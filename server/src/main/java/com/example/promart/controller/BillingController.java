package com.example.promart.controller;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;

import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.promart.service.BillingService;
import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class BillingController {

    private static final Logger logger = LoggerFactory.getLogger(BillingController.class);

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    @Autowired
    private BillingService billingService;

    @PostMapping("/online/save")
    public ResponseEntity<?> saveOnlineBill(@RequestBody BillingOnline bill) {
        if (bill == null || bill.getItems() == null || bill.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid bill data.");
        }
        try {
            bill.setBillGeneratedTime(LocalDateTime.now());
            BillingOnline savedBill = billingOnlineRepository.save(bill);
            billingService.updateProductSales(bill.getSellerId(), bill.getItems());
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            logger.error("Failed to save online bill for sellerId: {}", bill.getSellerId(), e);
            return ResponseEntity.status(500).body("Failed to save bill: " + e.getMessage());
        }
    }

    @PostMapping("/offline/save")
    public ResponseEntity<?> saveOfflineBill(@RequestBody BillingOffline bill) {
        if (bill == null || bill.getItems() == null || bill.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid bill data.");
        }
        try {
            bill.setBillGeneratedTime(LocalDateTime.now());
            BillingOffline savedBill = billingOfflineRepository.save(bill);
            billingService.updateProductSales(bill.getSellerId(), bill.getItems());
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            logger.error("Failed to save offline bill for sellerId: {}", bill.getSellerId(), e);
            return ResponseEntity.status(500).body("Failed to save bill: " + e.getMessage());
        }
    }

    // Get all orders for a specific seller
    @GetMapping("/get/online")
    public List<BillingOnline> getBillOnline(@RequestParam String sellerId) {
        return billingOnlineRepository.findBySellerId(sellerId);
    }

    // Get all orders for a specific seller
    @GetMapping("/get/offline")
    public List<BillingOffline> getBillOffline(@RequestParam String sellerId) {
        return billingOfflineRepository.findBySellerId(sellerId);
    }

}
