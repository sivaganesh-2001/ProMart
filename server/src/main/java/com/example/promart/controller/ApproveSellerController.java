package com.example.promart.controller;

import com.example.promart.model.ApproveSeller;
import com.example.promart.service.ApproveSellerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access the API
public class ApproveSellerController {
       @Autowired
    private final ApproveSellerService approveSellerService;

    public ApproveSellerController(ApproveSellerService approveSellerService) {
        this.approveSellerService = approveSellerService;
    }

    @GetMapping("/approvals")
    public List<ApproveSeller> getPendingApprovals() {
        return approveSellerService.getAllPendingApprovals();
    }

        @PostMapping("/approve-seller/{id}")
    public ResponseEntity<String> approveSeller(@PathVariable String id) {
        String message = approveSellerService.approveSeller(id);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/reject-seller/{id}")
    public ResponseEntity<String> rejectSeller(@PathVariable String id) {
        String message = approveSellerService.rejectSeller(id);
        return ResponseEntity.ok(message);
    }

}
