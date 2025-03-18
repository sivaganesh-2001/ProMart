package com.example.promart.controller;

import com.example.promart.model.ProductCategory;
import com.example.promart.repository.ProductCategoryRepository;
import com.example.promart.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")  // Allow requests from frontend
@RestController
@RequestMapping("/api/product-categories")
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;
    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @GetMapping
    public List<ProductCategory> getProductCategories() {
        return productCategoryService.getAllProductCategories();
    }

    @PostMapping
    public ProductCategory addProductCategory(@RequestBody ProductCategory productCategory) {
        return productCategoryService.addProductCategory(productCategory);
    }

    @DeleteMapping("/{id}")
    public void deleteProductCategory(@PathVariable String id) {
        productCategoryService.deleteProductCategory(id);
    }

    @PutMapping("/{id}")
    public ProductCategory updateProductCategory(@PathVariable String id, @RequestBody ProductCategory updatedCategory) {
        return productCategoryService.updateProductCategory(id, updatedCategory.getName());
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getApproveSellerCount() {
        long count = productCategoryRepository.count();
        return ResponseEntity.ok(count);
    }
}