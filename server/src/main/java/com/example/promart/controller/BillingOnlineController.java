package com.example.promart.controller;

import com.example.promart.service.BillingOnlineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class BillingOnlineController {

    // @Autowired
    // private BillingOnlineService billingOnlineService;

    // @GetMapping("/daily/{sellerId}")
    // public List<Map<String, Object>> getDailySales(@PathVariable String sellerId) {
    //     return billingOnlineService.getDailySales(sellerId);
    // }

    // @GetMapping("/weekly/{sellerId}")
    // public List<Map<String, Object>> getWeeklySales(@PathVariable String sellerId) {
    //     return billingOnlineService.getWeeklySales(sellerId);
    // }

    // @GetMapping("/monthly/{sellerId}")
    // public List<Map<String, Object>> getMonthlySales(@PathVariable String sellerId) {
    //     return billingOnlineService.getMonthlySales(sellerId);
    // }
}
