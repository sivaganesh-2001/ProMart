package com.example.promart.controller;

import com.example.promart.model.Order;
import com.example.promart.model.OrderHistory;
import com.example.promart.model.Seller;
import com.example.promart.repository.OrderRepository;
import com.example.promart.repository.OrderHistoryRepository;
import com.example.promart.repository.SellerRepository;
import com.example.promart.service.OrderService;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.promart.service.SellerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final SellerRepository sellerRepository;
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderRepository orderRepository, OrderHistoryRepository orderHistoryRepository,
            SellerRepository sellerRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderHistoryRepository = orderHistoryRepository;
        this.sellerRepository = sellerRepository;
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody Order orderRequest) {
        try {
            System.out.println("Received Order Request: " + orderRequest);

            if (orderRequest.getSellerId() == null || orderRequest.getSellerId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Seller ID is required.");
            }

            Order savedOrder = orderService.placeOrder(orderRequest);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error placing order: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrdersBySeller(@RequestParam String sellerEmail) {
        try {
            List<Order> orders = orderService.getOrdersBySeller(sellerEmail);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/customer")
    public List<Order> getOrdersByCustomer(@RequestParam String customerEmail) {
        return orderService.getOrdersByCustomerEmail(customerEmail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Order updatedOrder) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (existingOrderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Order existingOrder = existingOrderOpt.get();
        existingOrder.setStatus(updatedOrder.getStatus());

        if ("Delivered".equals(updatedOrder.getStatus()) || "Cancelled".equals(updatedOrder.getStatus())) {
            // Move to Order History
            OrderHistory orderHistory = new OrderHistory(existingOrder);
            orderHistoryRepository.save(orderHistory);

            // Remove order from Seller's collection
            Optional<Seller> sellerOpt = sellerRepository.findById(existingOrder.getSellerId());
            if (sellerOpt.isPresent()) {
                Seller seller = sellerOpt.get();
                seller.getOrders().removeIf(order -> order.getId().equals(id));
                sellerRepository.save(seller);
            }

            // Delete the order from active orders collection
            orderRepository.deleteById(id);
            return ResponseEntity.ok("Order moved to history");
        }

        orderRepository.save(existingOrder);
        return ResponseEntity.ok(existingOrder);
    }

}
