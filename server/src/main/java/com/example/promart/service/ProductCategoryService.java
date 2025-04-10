package com.example.promart.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.promart.model.ProductCategory;
import com.example.promart.repository.ProductCategoryRepository;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;


    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll();
    }

    public List<ProductCategory> getProductCategoriesByTopCategory(String topCategory) {
        return productCategoryRepository.findByTopCategory(topCategory);
    }

    public ProductCategory addProductCategory(ProductCategory productCategory) {
        return productCategoryRepository.save(productCategory);
    }

    public void deleteProductCategory(String id) {
        productCategoryRepository.deleteById(id);
    }

    public ProductCategory updateProductCategory(String id, String name) {
        ProductCategory category = productCategoryRepository.findById(id).orElse(null);
        if (category != null) {
            category.setName(name);
            return productCategoryRepository.save(category);
        }
        return null;
    }
}
