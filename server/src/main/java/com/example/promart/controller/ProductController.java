package com.example.promart.controller;

import com.example.promart.model.Product;
import com.example.promart.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
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
    public List<Product> searchProducts(@RequestParam("q") String query) {
        return productService.searchProducts(query);
    }

    // 🔹 API to fetch top 5 popular products
    @GetMapping("/popular") // This matches the frontend request
    public ResponseEntity<List<Product>> getPopularProducts() {
        List<Product> popularProducts = productService.getPopularProducts();
        return ResponseEntity.ok(popularProducts);
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

}
