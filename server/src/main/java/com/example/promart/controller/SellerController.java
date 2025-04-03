package com.example.promart.controller;
import com.example.promart.service.SellerService;
import java.util.List;
import java.util.Map;
import com.example.promart.model.Rating;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.example.promart.model.ApproveSeller;
import com.example.promart.model.Product;
import com.example.promart.model.Seller;
import com.example.promart.repository.SellerRepository;
import com.example.promart.service.ProductService;
import com.example.promart.service.SellerService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private static final Logger logger = LoggerFactory.getLogger(SellerController.class);

    @Autowired
    private SellerService sellerService;
    @Autowired
    private SellerRepository sellerRepository;

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

    @GetMapping("/getId/{email}")
    public ResponseEntity<String> getSellerIdByEmail(@PathVariable String email) {
    Seller seller = sellerService.getSellerByEmail(email);
    if (seller != null) {
        return ResponseEntity.ok(seller.getId()); // Return only the ID
    } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found");
    }
}

    // Endpoint to add a rating
    @PostMapping("/{sellerId}/ratings")
    public ResponseEntity<Rating> addRating(
            @PathVariable String sellerId,
            @RequestBody RatingRequest ratingRequest) {
        Rating rating = sellerService.addRating(
                sellerId,
                ratingRequest.getCustomerEmail(),
                ratingRequest.getRating(),
                ratingRequest.getReview()
        );
        return new ResponseEntity<>(rating, HttpStatus.CREATED);
    }

    // Endpoint to get all ratings for a seller
    @GetMapping("/{sellerId}/ratings")
    public ResponseEntity<List<Rating>> getRatingsForSeller(@PathVariable String sellerId) {
        List<Rating> ratings = sellerService.getRatingsForSeller(sellerId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
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

    @GetMapping("/count")
    public ResponseEntity<Long> getSellerCount() {
        long count = sellerRepository.count();
        return ResponseEntity.ok(count);
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

@DeleteMapping("/delete/{sellerId}")
public ResponseEntity<String> deleteSeller(@PathVariable String sellerId) {
    boolean isDeleted = sellerService.deleteSellerAndProducts(sellerId);

    if (isDeleted) {
        return ResponseEntity.ok("Seller and all associated products deleted successfully!");
    } else {
        return ResponseEntity.status(404).body("Seller not found!");
    }
}

class RatingRequest {
    private String customerEmail;
    private int rating;
    private String review;

    // Getters and setters
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getReview() { return review; }
    public void setReview(String review) { this.review = review; }
}

}
