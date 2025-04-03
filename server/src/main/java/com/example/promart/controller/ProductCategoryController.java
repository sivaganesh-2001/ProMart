package com.example.promart.controller;

import com.example.promart.model.ProductCategory;
import com.example.promart.repository.ProductCategoryRepository;
import com.example.promart.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")  // Allow frontend access
@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllProductCategories() {
        List<ProductCategory> categories = productCategoryService.getAllProductCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/topCategory")
    public ResponseEntity<List<ProductCategory>> getProductCategoriesByTopCategory(@RequestParam(required = false) String topCategory) {
        if (topCategory == null || topCategory.isEmpty()) {
            return ResponseEntity.badRequest().build();  // Return 400 Bad Request
        }

        List<ProductCategory> categories = productCategoryService.getProductCategoriesByTopCategory(topCategory);
        
        if (categories.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no categories found
        }

        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<ProductCategory> addProductCategory(@RequestBody ProductCategory productCategory) {
        ProductCategory newCategory = productCategoryService.addProductCategory(productCategory);
        return ResponseEntity.ok(newCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductCategory(@PathVariable String id) {
        productCategoryService.deleteProductCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateProductCategory(@PathVariable String id, @RequestBody ProductCategory updatedCategory) {
        ProductCategory updated = productCategoryService.updateProductCategory(id, updatedCategory.getName());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getProductCategoryCount() {
        long count = productCategoryRepository.count();
        return ResponseEntity.ok(count);
    }
}
