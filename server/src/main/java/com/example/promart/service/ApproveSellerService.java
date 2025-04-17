package com.example.promart.service;

import com.example.promart.model.ApproveSeller;
import com.example.promart.model.Seller;
import com.example.promart.repository.ApproveSellerRepository;
import com.example.promart.repository.SellerRepository;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ApproveSellerService {

    @Autowired
    private ApproveSellerRepository approveSellerRepository;

    @Autowired
    private SellerRepository sellerRepository;

    private static final Logger logger = LoggerFactory.getLogger(ApproveSellerService.class);

        public String approveSeller(String sellerId) {
            Optional<ApproveSeller> optionalSeller = approveSellerRepository.findById(sellerId);
            
            if (optionalSeller.isPresent()) {
                ApproveSeller approveSeller = optionalSeller.get();

                // Convert ApproveSeller to Seller
                Seller seller = new Seller(
                    approveSeller.getShopName(),
                    approveSeller.getOwnerName(),
                    approveSeller.getEmail(),
                    approveSeller.getPhone(),
                    approveSeller.getAddress(),
                    approveSeller.getCategories(),
                    approveSeller.getShopImageUrl(),
                    approveSeller.getLocation()
                );

                // Set products
                seller.setProducts(approveSeller.getProducts());

                // Save to sellers collection
                sellerRepository.save(seller);

                // Remove from approveSeller collection
                approveSellerRepository.deleteById(sellerId);

                // Update role in Firestore
                Firestore db = FirestoreClient.getFirestore();
                try {
                    CollectionReference usersRef = db.collection("users");
                    Query query = usersRef.whereEqualTo("email", approveSeller.getEmail());
                    ApiFuture<QuerySnapshot> querySnapshot = query.get();
                    
                    List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
                    
                    if (!documents.isEmpty()) {
                        for (QueryDocumentSnapshot document : documents) {
                            DocumentReference userRef = document.getReference();
                            logger.info("Updating role for user: {}", approveSeller.getEmail());
                            userRef.update("role", "seller").get();  // Blocking call to ensure update completes
                        }
                        logger.info("Firestore role updated successfully for seller: {}", approveSeller.getEmail());
                        return "Seller approved successfully!";
                    } else {
                        logger.warn("Seller approved, but no matching Firestore user found for email: {}", approveSeller.getEmail());
                        return "Seller approved, but user not found in Firestore!";
                    }
                } catch (InterruptedException | ExecutionException e) {
                    logger.error("Error updating Firestore role", e);
                    return "Seller approved, but failed to update role in Firestore!";
                }
            } else {
                logger.warn("Seller ID {} not found!", sellerId);
                return "Seller not found!";
            }
        }
        
    public String rejectSeller(String sellerId) {
        if (approveSellerRepository.existsById(sellerId)) {
            approveSellerRepository.deleteById(sellerId);
            return "Seller rejected successfully!";
        } else {
            return "Seller not found!";
        }
    }

    public List<ApproveSeller> getAllPendingApprovals() {
        return approveSellerRepository.findAll();
    }
    
}
