package com.example.promart.service;

import com.example.promart.model.ApproveSeller;
import com.example.promart.model.Product;
import com.example.promart.model.Rating;
import com.example.promart.model.Seller;
import java.util.List;

public interface SellerService {
    Seller registerSeller(Seller seller);
    List<Seller> getAllSellers();
    Seller getSellerByEmail(String email);
    List<Seller> getNearbySellers(double latitude, double longitude, double maxDistanceKm);
    public Seller getSellerById(String id);
    public List<Product> searchProducts(String shopId, String query);
      public ApproveSeller registerSellerApprove(ApproveSeller approveSeller);
      public List<ApproveSeller> getPendingApprovals() ;
      public String approveSeller(String email);
      public String rejectSeller(String email);
      public boolean approveOrRejectSeller(String sellerId, String status) ;
      public boolean deleteSellerAndProducts(String sellerId);
      public Rating addRating(String sellerId, String customerEmail, int rating, String review);
      public List<Rating> getRatingsForSeller(String sellerId);
}
