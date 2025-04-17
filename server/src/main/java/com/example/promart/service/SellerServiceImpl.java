package com.example.promart.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.promart.model.ApproveSeller;
import com.example.promart.model.Product;
import com.example.promart.model.Seller;
import com.example.promart.repository.ApproveSellerRepository;
import com.example.promart.repository.ProductRepository;
import com.example.promart.repository.SellerRepository;

@Service
public class SellerServiceImpl implements SellerService {

    @Override
    public Seller getSellerById(String sellerId) {
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found with ID: " + sellerId));
    }

    private static final Logger logger = LoggerFactory.getLogger(SellerServiceImpl.class);

    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private ApproveSellerRepository approveSellerRepository;

      @Autowired
    private ProductRepository productRepository;

    public boolean deleteSellerAndProducts(String sellerId) {
        // 🔹 Step 1: Find the Seller
        Optional<Seller> sellerOpt = sellerRepository.findById(sellerId);
        if (sellerOpt.isEmpty()) {
            return false; // Seller not found
        }

        Seller seller = sellerOpt.get();

        // 🔹 Step 2: Fetch All Products of the Seller
        List<Product> sellerProducts = productRepository.findBySellerId(sellerId);

        // 🔹 Step 3: Delete All Products
        for (Product product : sellerProducts) {
            productRepository.deleteById(product.getId());
        }

        // 🔹 Step 4: Delete Seller
        sellerRepository.deleteById(sellerId);
        
        return true;
    }

    @Override
    public Seller registerSeller(Seller seller) {
        Optional<Seller> existingSeller = sellerRepository.findByEmail(seller.getEmail());
        if (existingSeller.isPresent()) {
            throw new RuntimeException("Seller with this email already exists!");
        }
        return sellerRepository.save(seller);
    }

    @Override
    public List<Seller> getAllSellers() {
        return sellerRepository.findAll();
    }

    @Override
    public Seller getSellerByEmail(String email) {
        return sellerRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Seller not found!"));
    }

    @Override
    public List<Seller> getNearbySellers(double latitude, double longitude, double maxDistanceKm) {
        try {
            Point userLocation = new Point(longitude, latitude); // Correctly create the point from latitude and
                                                                 // longitude
            logger.info("Fetching nearby sellers for location: {}, {}", latitude, longitude);
            // Fetch the nearby sellers using the repository method
            List<Seller> sellers = sellerRepository.findByLocationNear(longitude, latitude, maxDistanceKm * 1000); 
            logger.info("Found {} sellers near location: {}, {}", sellers.size(), latitude, longitude);
            return sellers;
        } catch (Exception e) {
            logger.error("Error fetching nearby sellers", e);
            throw new RuntimeException("Error fetching nearby sellers", e);
        }
    }

 
    public List<Product> searchProducts(String shopId, String query) {
        // Find the seller by ID
        Optional<Seller> sellerOptional = sellerRepository.findById(shopId);

        if (sellerOptional.isPresent()) {
            Seller seller = sellerOptional.get();

            // Filter products that match the search query
            return seller.getProducts().stream()
                    .filter(product -> product.getProductName().toLowerCase().contains(query.toLowerCase()))
                    .collect(Collectors.toList());
        } else {
            return new ArrayList<>(); // Return empty if seller not found
        }
    }

    // Register Seller - Save in approveSellers Collection
 // Register Seller - Save in approveSellers Collection
@Override
public ApproveSeller registerSellerApprove(ApproveSeller approveSeller) {
    // Check if seller already exists in the sellers collection
    Optional<Seller> existingSeller = sellerRepository.findByEmail(approveSeller.getEmail());
    
    // Check if seller is already in the approveSellers collection
    Optional<ApproveSeller> existingRegisteredSeller = approveSellerRepository.findByEmail(approveSeller.getEmail());
    
    if (existingSeller.isPresent()) {
        throw new RuntimeException("Seller with this email already exists!");
    }

    if (existingRegisteredSeller.isPresent()) {
        throw new RuntimeException("Seller with this email is already pending approval!");
    }

    // Save the new seller for approval
    return approveSellerRepository.save(approveSeller);
}


    // Get All Pending Approvals
    public List<ApproveSeller> getPendingApprovals() {
        return approveSellerRepository.findAll();
    }

    // Approve Seller - Move from approveSellers to sellers collection
    public String approveSeller(String email) {
        Optional<ApproveSeller> approveSellerOpt = approveSellerRepository.findByEmail(email);
        if (approveSellerOpt.isPresent()) {
            ApproveSeller approveSeller = approveSellerOpt.get();

            // Move data to Seller collection
            Seller seller = new Seller(
                    approveSeller.getShopName(),
                    approveSeller.getOwnerName(),
                    approveSeller.getEmail(),
                    approveSeller.getPhone(),
                    approveSeller.getAddress(),
                    approveSeller.getCategories(),
                    approveSeller.getShopImageUrl(),
                    approveSeller.getLocation());

            sellerRepository.save(seller); // Save to sellers collection
            approveSellerRepository.deleteById(approveSeller.getId()); // Remove from approveSellers collection

            return "Seller approved successfully!";
        }
        return "Seller not found!";
    }

    // Reject Seller - Remove from approveSellers Collection
    public String rejectSeller(String email) {
        Optional<ApproveSeller> approveSellerOpt = approveSellerRepository.findByEmail(email);
        if (approveSellerOpt.isPresent()) {
            approveSellerRepository.deleteById(approveSellerOpt.get().getId());
            return "Seller rejected!";
        }
        return "Seller not found!";
    }

    public boolean approveOrRejectSeller(String sellerId, String status) {
        Optional<ApproveSeller> approveSellerOptional = approveSellerRepository.findById(sellerId);

        if (!approveSellerOptional.isPresent()) {
            logger.error("Seller with ID {} not found in approval list", sellerId);
            return false;
        }

        ApproveSeller approveSeller = approveSellerOptional.get();

        if ("approved".equalsIgnoreCase(status)) {
            // Convert ApproveSeller to Seller
            Seller newSeller = new Seller();
            newSeller.setShopName(approveSeller.getShopName());
            newSeller.setOwnerName(approveSeller.getOwnerName());
            newSeller.setEmail(approveSeller.getEmail());
            newSeller.setPhone(approveSeller.getPhone());
            newSeller.setAddress(approveSeller.getAddress());
            newSeller.setCategories(approveSeller.getCategories());
            newSeller.setShopImageUrl(approveSeller.getShopImageUrl());
            newSeller.setLocation(approveSeller.getLocation());
            newSeller.setProducts(approveSeller.getProducts());

            // Save to Seller collection
            sellerRepository.save(newSeller);
        }

        // Remove from ApproveSeller collection (whether approved or rejected)
        approveSellerRepository.deleteById(sellerId);
        logger.info("Seller {} successfully {}", sellerId, status);
        return true;
    }

    @Override
    public Seller getSeller(String sellerId) {
        return sellerRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
    }

    // @Override
    // @Transactional
    // public Seller rateSeller(String sellerId, String userId, double rating) {
    //     logger.info("Attempting to rate seller with ID: {}", sellerId);
        
    //     if (rating < 1 || rating > 5) {
    //         throw new IllegalArgumentException("Rating must be between 1 and 5");
    //     }
    
    //     Seller seller = sellerRepository.findById(sellerId)
    //             .orElseThrow(() -> {
    //                 logger.error("Seller with ID {} not found", sellerId);
    //                 return new RuntimeException("Seller not found");
    //             });
    
    //     Map<String, Double> ratings = seller.getRatings();
    //     Double oldRating = ratings.put(userId, rating); // Save the new rating or update existing one
    
    //     int totalRatings = seller.getTotalRatings();
    //     double currentAvg = seller.getAverageRating();
    
    //     if (oldRating == null) {
    //         // New rating: increment totalRatings and update average
    //         totalRatings += 1;
    //         seller.setTotalRatings(totalRatings);
    //         seller.setAverageRating((currentAvg * (totalRatings - 1) + rating) / totalRatings);
    //     } else {
    //         // Updated rating: adjust average without changing totalRatings
    //         seller.setAverageRating((currentAvg * totalRatings - oldRating + rating) / totalRatings);
    //     }
    
    //     logger.info("Updated seller rating: {} with new rating: {} by user: {}", sellerId, rating, userId);
    //     return sellerRepository.save(seller); // Persist changes to the database
    // }


    @Override
    @Transactional
    public Seller rateSeller(String sellerId, String userId, double rating) {
        logger.info("Attempting to rate seller with ID: {}", sellerId);
        Seller seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> {
                    logger.error("Seller with ID {} not found", sellerId);
                    return new RuntimeException("Seller not found");
                });
        seller.updateRating(userId, rating);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller findById(String sellerId) {
        return sellerRepository.findById(sellerId).orElseThrow(() -> new RuntimeException("Seller not found"));
    }
}