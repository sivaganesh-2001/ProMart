package com.example.promart.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.promart.model.ApproveSeller;
import com.example.promart.repository.ApproveSellerRepository;
import com.example.promart.service.ApproveSellerService;

@RestController
@RequestMapping("/api/sellers")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to access the API
public class ApproveSellerController {
    @Autowired
    private final ApproveSellerService approveSellerService;
    @Autowired
    private ApproveSellerRepository approveSellerRepository;

    public ApproveSellerController(ApproveSellerService approveSellerService) {
        this.approveSellerService = approveSellerService;
    }

    @GetMapping("/approve-seller/count")
    public ResponseEntity<Long> getApproveSellerCount() {
        long count = approveSellerRepository.count();
        return ResponseEntity.ok(count);
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
