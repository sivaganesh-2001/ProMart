package com.example.promart.controller;

import com.example.promart.model.BillingOnline;
import com.example.promart.model.BillingOffline;

import com.example.promart.repository.BillingOfflineRepository;
import com.example.promart.repository.BillingOnlineRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class BillingController {

    @Autowired
    private BillingOnlineRepository billingOnlineRepository;

    @Autowired
    private BillingOfflineRepository billingOfflineRepository;

    @PostMapping("/online/save")
    public ResponseEntity<?> saveOnlineBill(@RequestBody BillingOnline bill) {
    bill.setBillGeneratedTime(LocalDateTime.now());
    BillingOnline savedBill = billingOnlineRepository.save(bill);
    return ResponseEntity.ok(savedBill);
}

    @PostMapping("/offline/save")
    public ResponseEntity<?> saveOfflineBill(@RequestBody BillingOffline bill) {
    bill.setBillGeneratedTime(LocalDateTime.now());
    BillingOffline savedBill = billingOfflineRepository.save(bill);
    return ResponseEntity.ok(savedBill);
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
