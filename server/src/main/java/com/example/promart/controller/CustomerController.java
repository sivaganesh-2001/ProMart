package com.example.promart.controller;

import com.example.promart.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to call API
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @PostMapping("/save")
    public String saveCustomer(@RequestBody Map<String, String> requestData) {
        String customerName = requestData.get("customerName");
        String customerEmail = requestData.get("customerEmail");

        if (customerEmail == null || customerEmail.isEmpty()) {
            return "Error: customerEmail is required";
        }

        customerService.saveOrUpdateCustomer(customerName, customerEmail);
        return "Customer saved successfully";
    }
}
