package com.example.promart.controller;

import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.promart.dto.PaymentRequest;
import com.example.promart.dto.PaymentVerificationRequest;
import com.example.promart.service.PaymentService;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

        @Value("${razorpay.key.id}")
        private String RAZORPAY_KEY_ID;

        @Value("${razorpay.key.secret}")
        private String RAZORPAY_KEY_SECRET;


    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiatePayment(@RequestBody PaymentRequest paymentRequest) throws IOException {
        return paymentService.createOrder(paymentRequest);
    }
    

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationRequest verificationRequest) {
        return paymentService.verifySignature(verificationRequest);
    }
}
