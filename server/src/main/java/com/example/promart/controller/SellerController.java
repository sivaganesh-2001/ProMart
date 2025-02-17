package com.example.promart.controller;
import com.example.promart.model.ApproveSeller;
import com.example.promart.model.Product;
import com.example.promart.model.Seller;
import com.example.promart.service.ProductService;
import com.example.promart.service.SellerService;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private static final Logger logger = LoggerFactory.getLogger(SellerController.class);

    @Autowired

    private SellerService sellerService;

    private final ProductService productService;

    @Autowired
    public SellerController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Seller registerSeller(@RequestBody Seller seller) {
        return sellerService.registerSeller(seller);
    }

    @GetMapping
    public List<Seller> getAllSellers() {
        return sellerService.getAllSellers();
    }

    @GetMapping("/{email}")
    public Seller getSellerByEmail(@PathVariable String email) {
        return sellerService.getSellerByEmail(email);
    }

    @GetMapping("/nearby")
    public List<Seller> getNearbySellers(@RequestParam double latitude, @RequestParam double longitude) {
        try {
            List<Seller> sellers = sellerService.getNearbySellers(latitude, longitude, 30.0);
            return sellers;
        } catch (Exception e) {
            logger.error("Error fetching nearby sellers", e);
            throw new RuntimeException("Error fetching nearby sellers", e);
        }
    }


    @GetMapping("/id/{id}")
    public Seller getSellerById(@PathVariable String id) {
        return sellerService.getSellerById(id);
    }

    @GetMapping("/{sellerId}/products")
public ResponseEntity<List<Product>> getProductsBySeller(@PathVariable String sellerId) {
    Seller seller = sellerService.getSellerById(sellerId);
    if (seller != null) {
        return ResponseEntity.ok(seller.getProducts());
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}

@GetMapping("/{shopId}/products/search")
public List<Product> searchProducts(@PathVariable("shopId") String id, @RequestParam String query) {
    return sellerService.searchProducts(id, query);
}

  // Register Seller (Save to approveSellers collection)
    @PostMapping("/approve-seller")
    public String registerSeller(@RequestBody ApproveSeller approveSeller) {
        sellerService.registerSellerApprove(approveSeller);
        return "Seller registration submitted for approval!";
    }

    // Get All Pending Sellers for Approval
    @GetMapping("/pending")
    public List<ApproveSeller> getPendingSellers() {
        return sellerService.getPendingApprovals();
    }

    // Approve Seller and Move to Sellers Collection
    @PostMapping("/approve/{email}")
    public String approveSeller(@PathVariable String email) {
        return sellerService.approveSeller(email);
    }

    // Reject Seller and Remove from approveSellers Collection
    @DeleteMapping("/reject/{email}")
    public String rejectSeller(@PathVariable String email) {
        return sellerService.rejectSeller(email);
    }

    @PostMapping("/api/approve-seller/{id}")
public ResponseEntity<String> approveSeller(@PathVariable String id, @RequestBody Map<String, String> request) {
    String status = request.get("status");

    if (!"approved".equalsIgnoreCase(status) && !"rejected".equalsIgnoreCase(status)) {
        return ResponseEntity.badRequest().body("Invalid status. Use 'approved' or 'rejected'.");
    }

    boolean result = sellerService.approveOrRejectSeller(id, status);

    if (result) {
        return ResponseEntity.ok("Seller " + status + " successfully");
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found");
    }
}


}
