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

@Service
public class ApproveSellerService {

    @Autowired
    private ApproveSellerRepository approveSellerRepository;

    @Autowired
    private SellerRepository sellerRepository;


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
            approveSeller.getCustomCategory(),
            approveSeller.getPassword(),
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
            // Query Firestore to find the document with matching email
            CollectionReference usersRef = db.collection("users");
            Query query = usersRef.whereEqualTo("email", approveSeller.getEmail());
            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();
            if (!documents.isEmpty()) {
                for (QueryDocumentSnapshot document : documents) {
                    // Update the role field
                    DocumentReference userRef = document.getReference();
                    userRef.update("role", "seller").get();
                }
                return "Seller approved successfully!";
            } else {
                return "Seller approved, but user not found in Firestore!";
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            return "Seller approved, but failed to update role in Firestore!";
        }
    } else {
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
