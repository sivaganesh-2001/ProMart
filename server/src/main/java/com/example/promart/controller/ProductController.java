package com.example.promart.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.promart.dto.Rating;
import com.example.promart.model.MasterProduct;
import com.example.promart.model.Product; // Add this import for MasterProduct
import com.example.promart.repository.ProductRepository;
import com.example.promart.service.MasterProductService;
import com.example.promart.service.ProductService; // Add this import for MasterProductService

@RestController // Allow frontend to access the API
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/products")
public class ProductController {

    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private MasterProductService masterProductService; // Add this field for MasterProductService

    public ProductController(ProductService productService, ProductRepository productRepository,
            MasterProductService masterProductService) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.masterProductService = masterProductService;
    }

    @PostMapping("/")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        try {
            // Validate the presence of seller email
            if (product.getSellerEmail() == null || product.getSellerEmail().isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }

            // Call service to create product
            Product savedProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getProductCount() {
        long count = productRepository.count();
        return ResponseEntity.ok(count);
    }

    // Get all products
    @GetMapping
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found with ID: " + id);
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Product>> getProductsBySeller(@PathVariable String sellerId) {
        List<Product> products = productService.getProductsBySellerId(sellerId);
        return ResponseEntity.ok(products);
    }

    // Delete product
    // @DeleteMapping("/{id}")
    // public ResponseEntity<?> deleteProduct(@PathVariable String id) {
    // boolean deleted = productService.deleteProduct(id);
    // if (deleted) {
    // return ResponseEntity.ok("Product deleted successfully.");
    // } else {
    // return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not
    // found.");
    // }
    // }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("query") String query) { // Change "q" to "query"
        return productService.searchProducts(query);
    }

    // 🔹 API to fetch top 5 popular products
    @GetMapping("/popular") // This matches the frontend request
    public ResponseEntity<List<Product>> getPopularProducts() {
        List<Product> popularProducts = productService.getPopularProducts();
        return ResponseEntity.ok(popularProducts);
    }

    @GetMapping("/id")
    public List<Product> getProductsByIds(@RequestParam List<String> ids) {
        return productService.getProductsByIds(ids);
    }

    @DeleteMapping("/{productId}/seller/{sellerEmail}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable String productId,
            @PathVariable String sellerEmail) {
        boolean deleted = productService.deleteProduct(productId, sellerEmail);

        if (deleted) {
            return ResponseEntity.ok("Product deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller or Product not found.");
        }
    }

    @PutMapping("/{productId}")
    public Product updateProduct(@PathVariable String productId, @RequestBody Product updatedProduct) {
        return productService.updateProduct(productId, updatedProduct);
    }

    @PostMapping("/reduceStock")
    public ResponseEntity<?> reduceStock(@RequestBody Map<String, Integer> productQuantities) {
        try {
            productService.reduceStock(productQuantities);
            return ResponseEntity.ok("Stock reduced successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/match")
    public ResponseEntity<List<Product>> getMatchingProducts(@RequestParam String productName) {
        List<Product> matchedProducts = productRepository.findByProductNameIgnoreCaseContaining(productName);
        return ResponseEntity.ok(matchedProducts);
    }

    @GetMapping("/master/{masterId}")
    public ResponseEntity<?> getMasterProductById(@PathVariable String masterId) {
        try {
            MasterProduct masterProduct = masterProductService.findById(masterId);
            return ResponseEntity.ok(masterProduct);
        } catch (RuntimeException e) {
            logger.error("MasterProduct not found for ID {}: {}", masterId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "MasterProduct not found"));
        }
    }

    @PostMapping("/{productId}/rate")
    public ResponseEntity<?> rateMasterProduct(
            @PathVariable String productId,
            @RequestBody Rating ratingRequest) {
        try {
            MasterProduct updatedMasterProduct = masterProductService.rateMasterProduct(
                    productId, ratingRequest.getUserId(), ratingRequest.getRating());
            return ResponseEntity.ok(Map.of(
                    "message", "Product rating submitted successfully!",
                    "masterProduct", updatedMasterProduct));
        } catch (IllegalArgumentException e) {
            logger.error("Invalid rating for product {}: {}", productId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            logger.error("Error rating product ID {}: {}", productId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
