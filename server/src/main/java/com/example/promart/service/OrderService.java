package com.example.promart.service;

import com.example.promart.model.Order;
import com.example.promart.model.Seller;
import com.example.promart.repository.SellerRepository;
import com.example.promart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SellerRepository sellerRepository;

    public Order placeOrder(Order orderRequest) {
        // Set the orderDate to the current date and time
        orderRequest.setOrderDate(LocalDateTime.now());
    
        // 1️⃣ Save Order to Orders Collection
        Order savedOrder = orderRepository.save(orderRequest);
    
        // 2️⃣ Find Seller by sellerId
        Optional<Seller> sellerOptional = sellerRepository.findById(orderRequest.getSellerId());
    
        if (sellerOptional.isPresent()) {
            Seller seller = sellerOptional.get();
    
            // 3️⃣ Ensure orders list is initialized
            if (seller.getOrders() == null) {
                seller.setOrders(new ArrayList<>());
            }
    
            // 4️⃣ Add Order Reference to Seller's orders List
            seller.getOrders().add(savedOrder);
    
            // 5️⃣ Save Updated Seller
            sellerRepository.save(seller);
        } else {
            throw new RuntimeException("Seller not found with ID: " + orderRequest.getSellerId());
        }
    
        return savedOrder;
    }

    public List<Order> getOrdersByCustomerEmail(String customerEmail) {
        return orderRepository.findByCustomerEmail(customerEmail);
    }

    // Fetch Orders by Seller Email
    public List<Order> getOrdersBySeller(String sellerEmail) {
        Optional<Seller> sellerOpt = sellerRepository.findByEmail(sellerEmail);
        if (sellerOpt.isPresent()) {
            Seller seller = sellerOpt.get();
            return orderRepository.findBySellerId(seller.getId());
        } else {
            throw new RuntimeException("Seller not found with email: " + sellerEmail);
        }
    }

    // Update Order Status
    public void updateOrderStatus(String orderId, String newStatus) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setStatus(newStatus);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
    }
}
