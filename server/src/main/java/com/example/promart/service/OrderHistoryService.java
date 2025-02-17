package com.example.promart.service;

import com.example.promart.model.OrderHistory;
import com.example.promart.model.Seller;
import com.example.promart.repository.OrderHistoryRepository;
import com.example.promart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderHistoryService {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private OrderHistoryRepository orderHistoryRepository;

    public OrderHistoryService(OrderHistoryRepository orderHistoryRepository) {
        this.orderHistoryRepository = orderHistoryRepository;
    }

    public List<OrderHistory> getPastOrdersBySellerEmail(String sellerEmail) {
        // Find seller by email
        Optional<Seller> sellerOpt = sellerRepository.findByEmail(sellerEmail);

        if (sellerOpt.isPresent()) {
            String sellerId = sellerOpt.get().getId();

            // Fetch past orders from order_history for this seller
            List<OrderHistory> pastOrders = orderHistoryRepository.findBySellerId(sellerId);

            // Filter only completed orders (Delivered or Cancelled)
            return pastOrders.stream()
                    .filter(order -> order.getStatus().equalsIgnoreCase("Delivered") ||
                                     order.getStatus().equalsIgnoreCase("Cancelled"))
                    .collect(Collectors.toList());
        }
        return List.of(); // Return empty list if no seller found
    }

    public List<OrderHistory> getCustomerOrderHistory(String customerEmail) {
        return orderHistoryRepository.findByCustomerEmail(customerEmail);
    }
    
}
