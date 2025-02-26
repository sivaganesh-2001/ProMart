package com.example.promart.service;

import com.example.promart.model.Category;
import com.example.promart.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category addCategory(Category category) {
        category.setProductCount(0); // Default count
        category.setPopularityScore(0.0); // Default score
        return categoryRepository.save(category);
    }

    public Optional<Category> updateCategory(String id, Category updatedCategory) {
        return categoryRepository.findById(id).map(category -> {
            category.setName(updatedCategory.getName());
            return categoryRepository.save(category);
        });
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}
