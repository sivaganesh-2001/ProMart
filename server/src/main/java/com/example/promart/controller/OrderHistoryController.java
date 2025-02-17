package com.example.promart.controller;

import com.example.promart.model.OrderHistory;
import com.example.promart.service.OrderHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-history")
@CrossOrigin(origins = "http://localhost:3000") 
public class OrderHistoryController {

    @Autowired
    private OrderHistoryService orderHistoryService;

    @GetMapping("/seller/{sellerEmail}")
    public List<OrderHistory> getPastOrders(@PathVariable String sellerEmail) { 
        return orderHistoryService.getPastOrdersBySellerEmail(sellerEmail);
    }

    @GetMapping("/customer/{customerEmail}")
    public List<OrderHistory> getCustomerOrderHistory(@PathVariable String customerEmail) {
        return orderHistoryService.getCustomerOrderHistory(customerEmail);
    }

}

